from flask_sqlalchemy import SQLAlchemy
from tgb_bot import create_app
from tgb_bot.celery_app import celery_init_app, start_celery_app
from tgb_bot.models import User
from tgb_bot.nicelogger import NiceLogger
from werkzeug.security import generate_password_hash
from tgb_bot import app, celery

from tgb_bot.bot_utils import TaskHandler

app = app

celery = celery
celery.config_from_object(app.config)
task_handler = TaskHandler(celery)

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
        from tgb_bot import db
        db.session.add(new_user)
        db.session.commit()
        nicelogger.log("[+] Admin user created!")


with app.app_context():
    init_admin_user()

worker = celery.WorkController(app=celery, concurrency=1, loglevel="DEBUG")
try:
    worker.start()
except KeyboardInterrupt:
    print("Exiting...")
    worker.stop()
    

if __name__ == '__main__':
    app.run(debug=True)
    print("Hello World")
