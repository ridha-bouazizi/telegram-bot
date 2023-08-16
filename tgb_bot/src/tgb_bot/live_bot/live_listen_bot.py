import asyncio
import typer
from telethon.sync import TelegramClient, events
from telethon.sessions import StringSession

# Credentials
credentials = {
    "BOT ACCOUNT": {
        "APP TITLE": "atesttokenfortgb",
        "APP API ID": 6396820072,
        "APP API HASH": "6396820072:AAF52zMOT9Nu8Y-IR8idKiwKIdHF-jgXvXw",
        "APP API TOKEN": "6396820072:AAF52zMOT9Nu8Y-IR8idKiwKIdHF-jgXvXw"
    }
}

app = typer.Typer()


@app.command()
def listen():
    async def main():
        bot_account = "BOT ACCOUNT"
        app_title = credentials[bot_account]["APP TITLE"]
        app_api_id = credentials[bot_account]["APP API ID"]
        app_api_hash = credentials[bot_account]["APP API HASH"]
        app_api_token = credentials[bot_account]["APP API TOKEN"]

        async with TelegramClient(StringSession(''), app_api_id, app_api_hash) as client:
            print(f"Listening for messages on account: {bot_account}")
            
            @client.on(events.NewMessage)
            async def handle_new_message(event):
                from_user = await event.get_sender()
                message_text = event.message.message
                print(f"Received a message from: {from_user.username}")
                print(f"Message text: {message_text}")
                
            await client.start(bot_token=app_api_token)
            await client.run_until_disconnected()

    asyncio.run(main())


if __name__ == "__main__":
    app()
