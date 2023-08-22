import redis
from typing import Union

from .envVars import EnvVars

from .nicelogger import NiceLogger
from celery.signals import task_success
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
