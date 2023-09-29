import asyncio
import json
import os
from pprint import pprint
from typing import Union
from flask_sqlalchemy import SQLAlchemy
import redis
import telethon
from telethon.sync import TelegramClient, events, functions, types
from telethon.sessions import StringSession
from telethon.tl.custom.message import Message
from celery import Celery, Task, shared_task

from .envVars import EnvVars
from .models import Connection, ConnectionRefactorConfig
from .nicelogger import NiceLogger
from .bot_utils import ConnectionDetailsChecker, RedisCodeListener
from . import db
import logging

nicelogger = NiceLogger()
env_vars = EnvVars.get_env_vars().env_vars
logging.basicConfig(format='[%(levelname) 5s/%(asctime)s] %(name)s: %(message)s',
                    level=logging.WARNING)

if "REDIS_URL" in env_vars:
    redis_url = env_vars["REDIS_URL"]
    celery_app = Celery("tasks", broker=redis_url, backend=redis_url)
else:
    redis_url = "redis://localhost:6379"
    celery_app = Celery("tasks", broker="redis://localhost:6379", backend="redis://localhost:6379")
    nicelogger.log("[!] Redis URL not found, using localhost:6379")

@celery_app.task(name="sendCode", queue="generateSession")  # type: ignore
def handle_sendCode(conn_id: str) -> bool:
    # credentials = {
    #     "USER ACCOUNT": {
    #         "APP TITLE": "atesttokenfortgb",
    #         "APP API ID": 21895560,
    #         "APP API HASH": "8b11b3126c84627b78ba9e0e9f3290a8",
    #     }
    # }
    success = False
    async def main(conn_id=conn_id, success=success):
        # success = False
        connection = Connection.query.filter_by(id=conn_id).first()
        if connection is None:
            nicelogger.log("Connection not found")
            return success
        else:
            session = connection.session
            app_api_id = connection.apiID
            app_api_hash = connection.apiSecret
            phone = connection.phone
            try:
                listener = RedisCodeListener(conn_id, timeout=240)

                try:
                    client = await TelegramClient(StringSession(session), app_api_id, app_api_hash).start(phone=phone, code_callback=listener) # type: ignore

                    await asyncio.sleep(10)

                    session = client.session.save()
                    print(f'Session: {session}')
                    connection.session = session
                    connection.last_modified = db.func.current_timestamp()
                    try:
                        db.session.commit()
                        success = True
                    except Exception as e:
                        db.session.rollback()
                        nicelogger.log(f"Error: {e}")
                        return success
                    nicelogger.log("Session saved")
                except telethon.errors.rpcerrorlist.FloodWaitError:
                    nicelogger.log("Invalid phone number")
                    return success
                except telethon.errors.RPCError:
                    nicelogger.log("Invalid phone number")
                    return success

            except redis.exceptions.ConnectionError:
                nicelogger.log("Redis connection error")
                return success
        # surround in a try catch block
        
        # client = await TelegramClient(StringSession(session), app_api_id, app_api_hash).start(phone=phone, code_callback=listener) # type: ignore
        # # wait for 10s for the code to be sent
        # await asyncio.sleep(10)
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
    loop.close()
    return success
    
@celery_app.task(name="checkCode", queue="checkCode")  # type: ignore
def handle_checkCode(conn_id: str, code: str) -> Union[str, int]:
    # async def main(phone=phone, conn_id=conn_id, code=code):
    try:
        r = redis.Redis(host='localhost', port=6379, db=0)
        r.rpush(f'sentCodes:{conn_id}', f'{code}')
        return 1
    except redis.exceptions.ConnectionError:
        print("Redis connection error")
        return -1
    except Exception as e:
        print(f"Error: {e}")
        return -1

    # loop = asyncio.get_event_loop()
    # loop.run_until_complete(main())
    # loop.close()

@celery_app.task(name="startMessageListener")  # type: ignore
def startMessageListener(conn_id: str):
    connection = Connection.query.filter_by(id=conn_id).first()
    status = ""
    success = False
    if connection is None:
        status = "Connection not found"
        return status, success
    else:
        connectionRefactorConfig = ConnectionRefactorConfig.query.filter_by(connection_id=conn_id).first()
        async def main(connection=connection, connectionRefactorConfig=connectionRefactorConfig):
            client = TelegramClient(StringSession(connection.session), connection.apiID, connection.apiSecret) # type: ignore
            await client.connect()
            refactorConfig = json.loads(connectionRefactorConfig.config)
            fromName = refactorConfig["from_to"]["from"]
            toName = refactorConfig["from_to"]["to"]
            fromChannel = await client.get_entity(fromName)
            toChannel = await client.get_entity(toName)
            # await client.send_message(toChannel, "---[Bot started]---")
            nicelogger.log(f"[*] Bot started. Listening for messages from {fromName}:{fromChannel.id} to forward to {toName}:{toChannel.id} ...")
            # Start listening for messages from the fromChannel to forward to the toChannel indefinitely
            @client.on(events.NewMessage(from_users=fromChannel.id))
            async def newMessageHandler(event):
                # check if event is indeed a NewMessage event
                if isinstance(event, events.NewMessage.Event):
                    r = redis.Redis(host='localhost', port=6379, db=10)
                    r.rpush(f'rawMessages:{conn_id}', f'{event.message.raw_text}')
            client.add_event_handler(newMessageHandler)
            await client.start() # type: ignore
            await client.run_until_disconnected() # type: ignore
        
        loop = asyncio.get_event_loop()
        loop.run_until_complete(main())
        loop.close()

@celery_app.task(name="startMessageRefactorer")  # type: ignore
def startMessageRefactorer(conn_id: str):
    connection = Connection.query.filter_by(id=conn_id).first()
    status = ""
    success = False
    if connection is None:
        status = "Connection not found"
        return status, success
    else:
        connectionRefactorConfig = ConnectionRefactorConfig.query.filter_by(connection_id=conn_id).first()
        refactoringKeywords = connectionRefactorConfig.refactoring_keywords
        async def main(connection=connection, connectionRefactorConfig=connectionRefactorConfig):
            client = TelegramClient(StringSession(connection.session), connection.apiID, connection.apiSecret)
            await client.connect()
            refactorConfig = json.loads(connectionRefactorConfig.config)
            toName = refactorConfig["from_to"]["to"]
            toChannel = await client.get_entity(toName)            
            while True:
                r = redis.Redis(host='localhost', port=6379, db=10)
                rawMessage = r.lpop(f'rawMessages:{conn_id}')
                if rawMessage is not None:
                    rawMessage = rawMessage.decode('utf-8')
                    rawMessageLines = rawMessage.split("\n")
                    try:
                        # if refactorConfig["worker_settings"]["clear_empty_lines"]:
                        #     rawMessage = rawMessage.replace("\n\n", "\n")
                        # refactoredMessage = refactor(refactorConfig, rawMessage)
                        await client.send_message(toChannel, rawMessage)
                    except Exception as e:
                        print(f"Error: {e}")