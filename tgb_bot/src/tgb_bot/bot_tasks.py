import asyncio
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
from .models import Connection
from .nicelogger import NiceLogger
from .bot_utils import RedisCodeListener
from . import db

nicelogger = NiceLogger()
env_vars = EnvVars.get_env_vars().env_vars

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


# the function declared here apply_async(args=[conn_id, mode], queue="refactor")
@celery_app.task(name="start_refactor", queue="refactor")  # type: ignore
def start_refactor(conn_id, mode):
    # Credentials
    credentials = {
        "USER ACCOUNT": {
            "APP TITLE": "atesttokenfortgb",
            "APP API ID": 21895560,
            "APP API HASH": "8b11b3126c84627b78ba9e0e9f3290a8",
        }
    }

    def load_session_from_file(file_path):
        with open(file_path, "r") as file:
            session_string = file.read()

        print(f"Loaded session string: {session_string}")
        return session_string

    async def main():
        user_account = "USER ACCOUNT"
        app_title = credentials[user_account]["APP TITLE"]
        app_api_id = credentials[user_account]["APP API ID"]
        app_api_hash = credentials[user_account]["APP API HASH"]

        session_file = "atesttokenfortgb.session"

        # session_string = load_session_from_file(session_file)
        session_string = ""
        client = TelegramClient(StringSession(session_string), app_api_id, app_api_hash)
        async with client:
            client.start(phone="+21655014722")
            if not client.is_user_authorized():
                code = input("Enter the verification code you received: ")
                # Complete the authentication process with the received code
                await client.sign_in("+21655014722", code)
            # @client.on(events.NewMessage)
            # async def handle_new_message(event):
            #     from_user = await event.get_sender()
            #     message_text = event.message.message
            #     print(f"Received a message from: {from_user.username}")
            #     print(f"Message text: {message_text}")

            # await client.run_until_disconnected()

    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
    loop.close()
