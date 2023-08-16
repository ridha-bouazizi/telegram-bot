import asyncio
from pexpect import EOF
import typer
from telethon.sync import TelegramClient, events
from telethon.sessions import StringSession

# Credentials
credentials = {
    "USER ACCOUNT": {
        "APP TITLE": "atesttokenfortgb",
        "APP API ID": 21895560,
        "APP API HASH": "8b11b3126c84627b78ba9e0e9f3290a8"
    }
}

app = typer.Typer()


@app.command()
def listen(phone: str = typer.Option(..., "--phone", help="Phone number")):
    session = ''
    async def main(session=session):
        user_account = "USER ACCOUNT"
        app_title = credentials[user_account]["APP TITLE"]
        app_api_id = credentials[user_account]["APP API ID"]
        app_api_hash = credentials[user_account]["APP API HASH"]
        client = await TelegramClient(StringSession(''), app_api_id, app_api_hash).start(phone=phone)
        session = client.session.save()
    asyncio.run(main())
    return session


if __name__ == "__main__":
    app()