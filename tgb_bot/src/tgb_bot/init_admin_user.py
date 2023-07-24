from flask import current_app
from flask_sqlalchemy import SQLAlchemy
from tgb_bot.models import User
from tgb_bot.nicelogger import NiceLogger
from werkzeug.security import generate_password_hash


def init_admin_user():
    nicelogger = NiceLogger()
    email = app.config["INIT_USER_EMAIL"]
    password = app.config["INIT_USER_PASSWORD"]
    first_name = app.config["INIT_USER_FIRST_NAME"]
    admin = User.query.filter_by(email=email).first()
    if admin:
        nicelogger.log("[+] Admin user already exists!")
    else:
        nicelogger.log("[+] Creating admin user...")
        new_user = User(
            email=email,
            first_name=first_name,
            password=generate_password_hash(password, method="sha256"),
            isAdmin=True
        )
        db = SQLAlchemy()
        
        db.session.add(new_user)
        db.session.commit()
        nicelogger.log("[+] Admin user created!")