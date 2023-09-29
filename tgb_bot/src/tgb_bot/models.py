from enum import Enum
from flask_login import UserMixin
from . import db


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    first_name = db.Column(db.String(150))
    isAdmin = db.Column(db.Boolean, default=False)
    connections = db.relationship('Connection', backref='user')


class ConnectionType(Enum):
    USER = 'user'
    BOT = 'bot'

class WorkerType(Enum):
    GENERIC = 'generic'
    MESSAGE_LISTENER = 'message_listener'
    SEND_CODE = 'send_code'
    CHECK_CODE = 'check_code'
    MESSAGE_SENDER = 'message_sender'
    MESSAGE_REFACTORER = 'message_refactorer'

class WorkerStatus(Enum):
    STARTED = 'started'
    RUNNING = 'running'
    STOPPED = 'stopped'
    FINISHED = 'finished'
    FAILED = 'failed'
    UNKNOWN = 'unknown'
    REVOKED = 'revoked'

class Connection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150))
    phone = db.Column(db.String(150))
    apiID = db.Column(db.String(150))
    apiSecret = db.Column(db.String(150))
    type = db.Column(db.Enum(ConnectionType), default=ConnectionType.BOT)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    last_modified = db.Column(db.DateTime, default=db.func.current_timestamp())
    session = db.Column(db.String(500))

class ConnectionRefactorConfig(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    connection_id = db.Column(db.Integer, db.ForeignKey('connection.id'))
    config = db.Column(db.String(5000))
    last_modified = db.Column(db.DateTime, default=db.func.current_timestamp())

class ConnectionWorker(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    connection_id = db.Column(db.Integer, db.ForeignKey('connection.id'))
    worker_id = db.Column(db.String(150))
    status = db.Column(db.Enum(WorkerStatus), default=WorkerStatus.UNKNOWN)
    type = db.Column(db.Enum(WorkerType), default=WorkerType.GENERIC)
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    date_modified = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

class CeleryTasks():
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.String(150))
    name = db.Column(db.String(150))
    status = db.Column(db.String(150))
    result = db.Column(db.String(150))
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    date_modified = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())