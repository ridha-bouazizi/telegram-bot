import asyncio
import os
from pprint import pprint
from typing import Union
from flask import current_app
import redis
from telethon.sync import TelegramClient, events, functions, types
from telethon.sessions import StringSession
from telethon.tl.custom.message import Message
from celery import Celery, Task, shared_task
from .models import Connection
from .nicelogger import NiceLogger
from .bot_utils import RedisCodeListener

nicelogger = NiceLogger()

celery_app = Celery("tasks", broker="redis://localhost:6379")


@celery_app.task(name="sendCode", queue="codeTasks")  # type: ignore
def handle_sendCode(phone: str, conn_id: str) -> str:
    credentials = {
        "USER ACCOUNT": {
            "APP TITLE": "atesttokenfortgb",
            "APP API ID": 21895560,
            "APP API HASH": "8b11b3126c84627b78ba9e0e9f3290a8",
        }
    }
    session = ""

    async def main(session=session, phone=phone, conn_id=conn_id):
        user_account = "USER ACCOUNT"
        app_title = credentials[user_account]["APP TITLE"]
        app_api_id = credentials[user_account]["APP API ID"]
        app_api_hash = credentials[user_account]["APP API HASH"]
        listener = RedisCodeListener(conn_id, timeout=300)
        # surround in a try catch block
        
        client = await TelegramClient(StringSession(session), app_api_id, app_api_hash).start(phone=phone, code_callback=listener) # type: ignore
        # wait for 10s for the code to be sent
        await asyncio.sleep(10)
        session = client.session.save()

    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
    loop.close()
    print(f"Session: {session}")
    return session

@celery_app.task(name="checkCode", queue="codeTasks")  # type: ignore
def handle_checkCode(phone: str, conn_id: str, code: str) -> str:
    # async def main(phone=phone, conn_id=conn_id, code=code):
    r = redis.Redis(host='localhost', port=6379, db=0)
    r.rpush('sentCodes', f'{conn_id}:{code}')

    # loop = asyncio.get_event_loop()
    # loop.run_until_complete(main())
    # loop.close()
    return code


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
