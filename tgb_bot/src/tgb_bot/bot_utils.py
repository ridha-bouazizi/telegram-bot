import redis
from typing import Union

class RedisCodeListener:
    def __init__(self, conn_id: str, timeout=300):
        self.conn_id = conn_id
        self.timeout = timeout
        self.redis_client = redis.Redis(host='localhost', port=6379, db=0)

    def __call__(self) -> Union[str, int]:
        while True:
            _, message = self.redis_client.blpop("sentCodes", timeout=self.timeout) # type: ignore
            
            if message:
                message_str = message.decode('utf-8')
                key_value_pairs = message_str.split(':')
                
                if len(key_value_pairs) == 2:
                    received_key, value = key_value_pairs
                    if received_key == self.conn_id:
                        print(f"Received item with key '{self.conn_id}': {value}")
                        return int(value)
            else:
                print(f"Timeout of {self.timeout} seconds reached. No item received.")
                return -1
