from http.client import HTTPException
from flask import Flask, render_template, flash, redirect, url_for, request
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager
from tgb_bot.http_exceptions import Custom302Exception
from .envVars import EnvVars
from .nicelogger import NiceLogger
from werkzeug.security import generate_password_hash

nicelogger = NiceLogger()

nicelogger.log("[*] Loading environment variables...")

env_vars = EnvVars.get_env_vars().env_vars

nicelogger.log("[+]   Environment variables loaded!")

# outputting env variables
for key, value in env_vars.items():
    nicelogger.log(f"[-]     {key}: {value}")
if "DB_NAME" in env_vars:
    DB_NAME = env_vars["DB_NAME"]
else:
    DB_NAME = "tgb.db.sqlite"
if "SECRET_KEY" in env_vars:
    SECRET_KEY = env_vars["SECRET_KEY"]
else:
    SECRET_KEY = "3PfMNY2Q6zDk+rI2/l4hBTFFT8RqA2OmLg4KCiQ2GdcHUHnWpeP+RZFZnAxOe5GHu/7ke3nBuTwFxjNuyMlmBg=="  # noqa: E501
if "INIT_USER_EMAIL" in env_vars:
    INIT_USER_EMAIL = env_vars["INIT_USER_EMAIL"]
else:
    INIT_USER_EMAIL = "admin@example.com"
if "INIT_USER_PASSWORD" in env_vars:
    INIT_USER_PASSWORD = env_vars["INIT_USER_PASSWORD"]
else:
    INIT_USER_PASSWORD = "admin"
if "INIT_USER_FIRST_NAME" in env_vars:
    INIT_USER_FIRST_NAME = env_vars["INIT_USER_FIRST_NAME"]
else:
    INIT_USER_FIRST_NAME = "Admin"

nicelogger.log("[*] Loading database...")

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)

    app.config["INIT_USER_FIRST_NAME"] = INIT_USER_FIRST_NAME
    app.config["INIT_USER_PASSWORD"] = INIT_USER_PASSWORD
    app.config["INIT_USER_EMAIL"] = INIT_USER_EMAIL
    app.config["DB_NAME"] = DB_NAME
    app.config["SECRET_KEY"] = SECRET_KEY
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_NAME}"

    db.init_app(app)
        
    from .views import views
    from .auth import auth

    app.register_blueprint(views, url_prefix="/")
    app.register_blueprint(auth, url_prefix="/")


    from .models import User

    with app.app_context():
        db.create_all()

    login_manager = LoginManager()
    login_manager.login_view = "auth.login"  # type: ignore
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(id):
        return User.query.get(int(id))

    @app.errorhandler(404)
    def page_not_found(e):
        # note that we set the 404 status explicitly
        return render_template('404.html', error=404), 404
    
    return app


def create_database(app):
    if not path.exists("tgb_bot/" + DB_NAME):
        db.create_all(app=app)
        print("Created Database!")

