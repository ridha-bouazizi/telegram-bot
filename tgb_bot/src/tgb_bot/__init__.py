from http.client import HTTPException
from flask import Flask, render_template, flash, redirect, url_for, request
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager, current_user
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
if "REDIS_URL" in env_vars:
    env_vars["CELERY_BROKER_URL"] = env_vars["REDIS_URL"]
    env_vars["CELERY_RESULT_BACKEND"] = env_vars["REDIS_URL"]
else:
    env_vars["CELERY_BROKER_URL"] = "redis://localhost:6379"
    env_vars["CELERY_RESULT_BACKEND"] = "redis://localhost:6379"
    env_vars["REDIS_URL"] = "redis://localhost:6379"
    nicelogger.log("[!] Redis URL not found, using localhost:6379")
if "CELERY_DEFAULT_WORKER_NAME" not in env_vars:
    env_vars["CELERY_DEFAULT_WORKER_NAME"] = "default_worker"
    nicelogger.log("[!] Celery worker name not found, using default_worker")
if "CELERY_WORKER_CONCURRENCY" not in env_vars:
    env_vars["CELERY_WORKER_CONCURRENCY"] = 8 # type: ignore
    nicelogger.log("[!] Celery worker concurrency not found, using 1")
    

nicelogger.log("[*] Loading database...")

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)

    app.config["INIT_USER_FIRST_NAME"] = INIT_USER_FIRST_NAME
    app.config["INIT_USER_PASSWORD"] = INIT_USER_PASSWORD
    app.config["INIT_USER_EMAIL"] = INIT_USER_EMAIL
    app.config["DB_NAME"] = DB_NAME
    app.config["SECRET_KEY"] = SECRET_KEY
    app.config["REDIS_URL"] = env_vars["REDIS_URL"]
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_NAME}"
    app.config["CELERY_DEFAULT_WORKER_NAME"] = env_vars["CELERY_DEFAULT_WORKER_NAME"]
    app.config["CELERY_WORKER_CONCURRENCY"] = int(env_vars["CELERY_WORKER_CONCURRENCY"])
    app.config.from_mapping(
        CELERY=dict(
            broker_url=env_vars["CELERY_BROKER_URL"],
            result_backend=env_vars["CELERY_RESULT_BACKEND"],
            task_serializer="json",
            result_serializer="json",
            accept_content=["json"],
            task_ignore_result=True
        )
    )
    db.init_app(app)
        
    from .views import views
    from .auth import auth
    from .bot_task_routes import bot_task_routes

    app.register_blueprint(views, url_prefix="/")
    app.register_blueprint(auth, url_prefix="/")
    app.register_blueprint(bot_task_routes, url_prefix="/scheduler")


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
        return render_template('404.html', error=404, user=current_user), 404
    
    return app


def create_database(app):
    if not path.exists("tgb_bot/" + DB_NAME):
        db.create_all(app=app)
        print("Created Database!")

