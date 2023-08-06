import time
from celery import Celery, Task, current_app, shared_task

@shared_task
def timer(a: int) -> int:
    # sleep for a seconds printing everu 5 seconds
    for i in range(a):
        if i % 5 == 0:
            print(i)
        time.sleep(1)
    return a