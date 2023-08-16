from telethon.sync import TelegramClient

# Your API credentials (obtained from https://my.telegram.org/auth)
credentials = {
    "USER ACCOUNT": {
        "APP TITLE": "atesttokenfortgb",
        "APP API ID": 21895560,
        "APP API HASH": "8b11b3126c84627b78ba9e0e9f3290a8"
    }
}
api_id = credentials["USER ACCOUNT"]["APP API ID"]
api_hash = credentials["USER ACCOUNT"]["APP API HASH"]

phone_number = '+21655014722'
with TelegramClient('anon', api_id, api_hash).start(phone=phone_number, code_callback=) as client:
    # Request a verification code  # Replace with the phone number you want to authenticate
    if not client.is_user_authorized():
        code = input("Enter the verification code you received: ")
        # Complete the authentication process with the received code
        client.sign_in('+21655014722', code)
    sent_code = client.send_code_request(phone_number)

    print("Sent verification code:", sent_code)
