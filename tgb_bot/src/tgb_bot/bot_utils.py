import json
import redis
from typing import Union

from .envVars import EnvVars

from .nicelogger import NiceLogger
from celery.signals import task_success, task_failure, task_revoked, task_prerun, task_postrun
from .models import Connection, ConnectionRefactorConfig
import telethon
from telethon.sync import TelegramClient
from telethon.sessions import StringSession
from telethon.tl.custom.message import Message

class TaskHandler:

    def __init__(self, app):
        self.app = app
        self.connect_signals()

    def connect_signals(self):
        task_success.connect(self.handle_sendCode_success)
        task_success.connect(self.handle_sendCode_failure)

    def handle_sendCode_success(self, sender, result, **kwargs):
        
        if sender.name == "app.sendCode":
            print(f"sendCode completed successfully with result: {result}")
            # Perform actions specific to Task1

    def handle_sendCode_failure(self, sender, result, **kwargs):
        
        if sender.name == "app.sendCode":
            print(f"sendCode failed with result: {result}")
            # Perform actions specific to Task1

class RedisCodeListener:
    
    def __init__(self, conn_id: str, timeout=300):
        self.nicelogger = NiceLogger()
        self.env_vars = EnvVars.get_env_vars().env_vars

        if "REDIS_URL" in self.env_vars:
            self.redis_url = self.env_vars["REDIS_URL"]
        else:
            self.redis_url = "redis://localhost:6379"
            self.nicelogger.log("[!] Redis URL not found, using localhost:6379")
        self.conn_id = conn_id
        self.timeout = timeout
        self.redis_client = redis.Redis().from_url(self.redis_url, db=0)

    def __call__(self) -> Union[str, int]:
        while True:
            try:
                _, code = self.redis_client.brpop(f'sentCodes:{self.conn_id}', timeout=self.timeout) # type: ignore
            except redis.exceptions.ConnectionError:
                print("Redis connection error")
                return -1
            # except redis.exceptions.TimeoutError:
            except redis.exceptions.TimeoutError:
                print("Redis timeout error")
                return -1
            except Exception as e:
                print(f"Error: {e}")
                return -1
            
            if code:
                code_str = code.decode('utf-8')
                print(f"Code received: {code_str}")
                return int(code_str)
            else:
                print(f"Timeout of {self.timeout} seconds reached. No item received.")
                return -1
class ConnectionDetailsChecker:
    
    def __init__(self, connection: Connection, connectionRefactorConfig: ConnectionRefactorConfig, success=False, status=""):
        self.nicelogger = NiceLogger()
        self.connection = connection
        self.success = success
        self.status = status
        self.connectionRefactorConfig = connectionRefactorConfig
        try:
            self.session = connection.session
            self.app_api_id = connection.apiID
            self.app_api_hash = connection.apiSecret
        except Exception as e:
            self.nicelogger.log(f"[X] Error: {e}")
            self.status = f"[X] Error: {e}"

    async def checkConnectionDetails(self):
        if (self.connection is None):
            self.status = "Connection not found"
            return self.success, self.status
        else:
            if (self.session is None or self.app_api_id is None or self.app_api_hash is None):
                self.status = "Connection details not found"
                return self.success, self.status
            try:
                client = TelegramClient(StringSession(self.session), self.app_api_id, self.app_api_hash) # type: ignore
                await client.connect()
                if (await client.is_user_authorized()):
                    if (self.connectionRefactorConfig.config is None):
                        self.status = "Connection config not found"
                        return self.success, self.status
                    else:
                        refactorConfig = json.loads(self.connectionRefactorConfig.config)
                        fromName = refactorConfig["from_to"]["from"]
                        toName = refactorConfig["from_to"]["to"]
                        if (fromName is None or toName is None) or (fromName == "" or toName == ""):
                            self.status = "Channel details are empty."
                            return self.success, self.status
                        else:
                            fromChannel = await client.get_entity(fromName)
                            toChannel = await client.get_entity(toName)
                            if (fromChannel is None or toChannel is None):
                                self.status = "Channel details are invalid."
                                return self.success, self.status
                            else:    
                                client.disconnect()
                                self.success = True
                                self.status = "User already authorized, connection details are valid."
                                return self.success, self.status
            except Exception as e:
                self.nicelogger.log(f"[X] Error: {e}")
                self.status = f"[X] Error: {e}"
                return self.success, self.status
            
class MessageRefactorer:
    # refactorConfig = {
    #     "filters": {
    #         "ci": [],
    #         "cs": [],
    #         "rgx": [
    #             {
    #                 "dqsdqs": [
    #                     {
    #                         "6": ""
    #                     }
    #                 ]
    #             },
    #             {
    #                 "qsdqsd": [
    #                     {
    #                         "6": ""
    #                     }
    #                 ]
    #             },
    #             {
    #                 "sqdqsdqsd": [
    #                     {
    #                         "6": ""
    #                     }
    #                 ]
    #             },
    #             {
    #                 "qsdqsdqsd": [
    #                     {
    #                         "6": ""
    #                     }
    #                 ]
    #             }
    #         ]
    #     },
    #     "from_to": {
    #         "from": "src",
    #         "to": "dst"
    #     },
    #     "worker_settings": {
    #         "block": {},
    #         "mode": {
    #             "block": false,
    #             "block_save_log": false,
    #             "mode": "LIVE"
    #         },
    #         "run_state": {
    #             "run": "INFINITE"
    #         }
    #     }
    # }

    def __init__(self, refactorConfig, rawMessage):
        self.nicelogger = NiceLogger()
        self.refactorConfig = refactorConfig
        self.rawMessage = rawMessage
        self.filters = self.refactorConfig["filters"]

    def parseMessageLines(self) -> list:
        lines = self.rawMessage.split("\n")
        return lines
    
    def checkForFilterHits(self, lines: list) -> list:
        hits = []
        for line in lines:
            hit = checkForFilterHits(line)
            if hit:
                hits.append(hit)
        return hits