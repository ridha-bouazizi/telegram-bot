from flask import Blueprint, request
from flask_login import login_required
import redis
from tgb_bot.bot_tasks import handle_checkCode, handle_sendCode, startMessageListener, startMessageRefactorer

from .nicelogger import NiceLogger
from .models import (
    Connection,
    ConnectionRefactorConfig,
    ConnectionWorker,
    WorkerStatus,
    WorkerType,
)
import telethon
from telethon.sync import TelegramClient
from telethon.sessions import StringSession
from .bot_utils import ConnectionDetailsChecker
from . import db


bot_task_routes = Blueprint("bot_task_routes", __name__)
niceLogger = NiceLogger()


@bot_task_routes.post("/submitCode")  # type: ignore
@login_required
def generateSession():
    conn_id = request.form.get("conn_id")
    code = request.form.get("code")
    result = handle_checkCode.apply_async(args=[conn_id, code], queue="checkCode")
    return {"result_id": result.id}


@bot_task_routes.get("/workers/start")  # type: ignore
@login_required
async def start_worker():
    conn_id = request.args.get("conn_id")
    connection = Connection.query.filter_by(id=conn_id).first()
    if connection is None:
        return {"status": "Connection not found"}
    else:
        try:
            connectionRefactorConfig = ConnectionRefactorConfig.query.filter_by(
                connection_id=conn_id
            ).first()
            connectionDetailsChecker = ConnectionDetailsChecker(
                connection, connectionRefactorConfig
            )
            checkConnectionSuccess, checkConnectionStatus = await connectionDetailsChecker.checkConnectionDetails()  # type: ignore
            if checkConnectionSuccess:
                try:
                    # Check if an old connectionWorker with type=WorkerType.MESSAGE_LISTENER exists and delete it
                    oldConnectionListener = ConnectionWorker.query.filter_by(
                        connection_id=conn_id, type=WorkerType.MESSAGE_LISTENER
                    ).first()
                    oldConnectionRefactorer = ConnectionWorker.query.filter_by(
                        connection_id=conn_id, type=WorkerType.MESSAGE_REFACTORER
                    ).first()
                    if oldConnectionListener is not None:
                        # Revoke the old worker
                        oldListenerResult = startMessageListener.AsyncResult(
                            oldConnectionListener.worker_id
                        )
                        oldListenerResult.revoke(terminate=True)
                        # Delete the old worker from the database
                        db.session.delete(oldConnectionListener)
                        db.session.commit()
                    if oldConnectionRefactorer is not None:
                        # Revoke the old worker
                        oldRefactorerResult = startMessageRefactorer.AsyncResult(
                            oldConnectionRefactorer.worker_id
                        )
                        oldRefactorerResult.revoke(terminate=True)
                        # Delete the old worker from the database
                        db.session.delete(oldConnectionRefactorer)
                        db.session.commit()
                except Exception as e:
                    return {"Success": False, "message": f"Error: {e}"}
                r = redis.Redis(host="localhost", port=6379, db=10)
                # Clear the queue f'rawMessages:{conn_id}' if it exists withuot deleting the queue itself
                r.delete(f"rawMessages:{conn_id}")
                listener = startMessageListener.apply_async(
                    args=[conn_id], queue=f"messageListener:{conn_id}"
                )
                connectionListener = ConnectionWorker(
                    connection_id=conn_id,
                    worker_id=listener.id,
                    status=WorkerStatus.STARTED,
                    type=WorkerType.MESSAGE_LISTENER,
                    date_created=db.func.current_timestamp(),
                    date_modified=db.func.current_timestamp()
                )
                refactorer = startMessageRefactorer.apply_async(
                    args=[conn_id], queue=f"messageRefactorer:{conn_id}"
                )
                connectionRefactorer = ConnectionWorker(
                    connection_id=conn_id,
                    worker_id=refactorer.id,
                    status=WorkerStatus.STARTED,
                    type=WorkerType.MESSAGE_REFACTORER,
                    date_created=db.func.current_timestamp(),
                    date_modified=db.func.current_timestamp()
                )
                try:
                    db.session.add(connectionRefactorer)
                    db.session.add(connectionListener)
                    db.session.commit()
                    return {
                        "Success": True,
                        "status": "Worker started",
                        "listener_id": listener.id,
                        "refactorer_id": refactorer.id,
                    }
                except Exception as e:
                    return {"Success": False, "message": f"Error: {e}"}
        except Exception as e:
            return {"Success": False, "message": f"Error: {e}"}  # type: ignore


@bot_task_routes.get("/workers/stop")  # type: ignore
@login_required
async def stop_worker():
    connection_id = request.args.get("connection_id")
    done = False
    doneForListener = False
    doneForRefactorer = False
    while not done:
        try:
            connectionListener = ConnectionWorker.query.filter_by(
                connection_id=connection_id, type=WorkerType.MESSAGE_LISTENER
            ).first()
            connectionRefactorer = ConnectionWorker.query.filter_by(
                connection_id=connection_id, type=WorkerType.MESSAGE_REFACTORER
            ).first()
            if connectionListener is not None:
                listenerResult = startMessageListener.AsyncResult(
                    connectionListener.worker_id
                )
                listenerResult.revoke(terminate=True)
                db.session.delete(connectionListener)
                db.session.commit()
            else:
                doneForListener = True
            if connectionRefactorer is not None:
                refactorerResult = startMessageRefactorer.AsyncResult(
                    connectionRefactorer.worker_id
                )
                refactorerResult.revoke(terminate=True)
                db.session.delete(connectionRefactorer)
                db.session.commit()
            else:
                doneForRefactorer = True
            if doneForListener and doneForRefactorer:
                done = True
        except Exception as e:
            done = True
            niceLogger.log(f"[X] Error: {e}")
    return {"status": "Worker stopped"}
