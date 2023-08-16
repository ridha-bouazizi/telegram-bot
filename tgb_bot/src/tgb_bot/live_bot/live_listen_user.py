import asyncio
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
def listen():
    async def main():
        user_account = "USER ACCOUNT"
        app_title = credentials[user_account]["APP TITLE"]
        app_api_id = credentials[user_account]["APP API ID"]
        app_api_hash = credentials[user_account]["APP API HASH"]
        string = '1BJWap1sBu5ezY0lWRVKag_yWua3zCibHd23PMYZfqS2Xq1qtOwCDmYAyT6xX56Gmc7VTXiI8FJZe2x76YM-vJRwmNiee2F4O_jLQfc5sWte_rp_s6_ZHg28pEM3RcnVYPwKUwaX5i4yHVYNtGn560QCx76TfbwFRsozxz50UVpYJUnE23Ub8S2CZJ4tRuZx5i4Kw20J1qrkrtlTGHuWhUxYfCNwojgOUTBZCy1wUDgqKg9jOM5sOaJ_-QLj7ZXDt2QNya6kERBToyseQXbVVwjKBKQ2BTC7tvCFb_pHggux8MinD3Gak24Eb-Gp0PbUakTKsAsPgdJO5O1GLmhopQWuhM9SbhuU='
        async with TelegramClient(StringSession(string), app_api_id, app_api_hash) as client:
            print(f"Listening for messages on account: {user_account}")
            string = client.session.save()
            @client.on(events.NewMessage)
            async def handle_new_message(event):
                from_user = await event.get_sender()
                message_text = event.message.message
                print(f"Received a message from: {from_user.username}")
                print(f"Message text: {message_text}")
                
            await client.run_until_disconnected()

    asyncio.run(main())


if __name__ == "__main__":
    app()