import redis


def listen_to_sent_code(conn_id, timeout=300):
    r = redis.Redis(host='localhost', port=6379, db=0)
    while True:
        # Block and wait for an item in the queue sent using : r.rpush('sendCode', 'key:value')
        _, message = r.blpop("sendCode", timeout=timeout) # type: ignore
        
        if message:
            message_str = message.decode('utf-8')
            key_value_pairs = message_str.split(':')
            
            if len(key_value_pairs) == 2:
                received_key, value = key_value_pairs
                if received_key == conn_id:
                    print(f"Received item with key '{conn_id}': {value}")
                    return value
        else:
            print(f"Timeout of {timeout} seconds reached. No item received.")
            return None