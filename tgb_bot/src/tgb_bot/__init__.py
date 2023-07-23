from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager
from .envVars import EnvVars
from .nicelogger import NiceLogger

nicelogger = NiceLogger()

nicelogger.log("[*] Loading environment variables...")
env_vars = EnvVars.get_env_vars().get_env_vars
nicelogger.log("[+]   Environment variables loaded!")
# outputting env variables
for key, value in env_vars.get_env_vars().env_vars.items():
    nicelogger.log(f"[-]     {key}: {value}")

nicelogger.log("[*] Loading database...")
db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    if "DB_NAME" in env_vars.items():
        DB_NAME = env_vars.items()["DB_NAME"]
    else:
        DB_NAME = "tgb.db"
    if "SECRET_KEY" in env_vars.items():
        app.config["SECRET_KEY"] = env_vars.items()["SECRET_KEY"]
    else:
        app.config[
            "SECRET_KEY"
        ] = "3PfMNY2Q6zDk+rI2/l4hBTFFT8RqA2OmLg4KCiQ2GdcHUHnWpeP+RZFZnAxOe5GHu/7ke3nBuTwFxjNuyMlmBg=="  # noqa: E501
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_NAME}"
    db.init_app(app)

    from .views import views
    from .auth import auth

    app.register_blueprint(views, url_prefix="/")
    app.register_blueprint(auth, url_prefix="/")

    with app.app_context():
        db.create_all()

    login_manager = LoginManager()
    login_manager.login_view = "auth.login" # type: ignore
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(id):
        return User.query.get(int(id))

    return app


def create_database(app):
    if not path.exists("website/" + DB_NAME):
        db.create_all(app=app)
        print("Created Database!")
