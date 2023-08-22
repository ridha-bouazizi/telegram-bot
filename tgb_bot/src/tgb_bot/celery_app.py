from __future__ import absolute_import, unicode_literals
import datetime
import logging
import multiprocessing
import os
import subprocess
from celery import Celery, Task, current_app
from flask import Flask, jsonify
import psutil
from .nicelogger import NiceLogger


nicelogger = NiceLogger()

def celery_init_app(app: Flask) -> Celery:
    class FlaskTask(Task):
        def __call__(self, *args: object, **kwargs: object) -> object:
            with app.app_context():
                return self.run(*args, **kwargs)

    celery_app = Celery(app.name, task_cls=FlaskTask)
    celery_app.config_from_object(app.config["CELERY"])
    celery_app.set_default()

    available_cores = get_available_cores()
    concurrency = app.config["CELERY_WORKER_CONCURRENCY"]
    if concurrency > available_cores:
        nicelogger.log(
            f"[!] Celery worker concurrency ({concurrency}) is greater than available cores ({available_cores}). "
            f"Setting concurrency to {available_cores}"
        )
        concurrency = available_cores
    celery_app.conf.update(
        CELERYD_CONCURRENCY=concurrency,
        CELERYD_PREFETCH_MULTIPLIER=1
    )
    celery_app.conf.update(app.config)
    # timestamp = datetime.datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    # worker_name = app.config["CELERY_DEFAULT_WORKER_NAME"]
    # log_file_name = f"{worker_name}_{timestamp}.log"
    # log_formatter = logging.Formatter(
    #     "%(asctime)s [%(levelname)s] %(message)s",
    #     "%Y-%m-%dT%H:%M:%SZ"
    # )
    # log_handler = logging.FileHandler(log_file_name)
    # log_handler.setFormatter(log_formatter)
    # log_handler.setLevel(logging.INFO)
    # logging.root.addHandler(log_handler)
    # Set up the command-line arguments
    # args = [
    #     "worker",
    #     "-Q", f"queue_{worker_name}",  # Specify queue name
    #     "--concurrency", str(concurrency),  # Adjust the concurrency as needed
    #     "--loglevel", "info",
    #     "--logfile", f"celery_{worker_name}.log",
    #     "--pidfile", f"pidfile_{worker_name}.pid",  # Specify a pid file per worker
    # ]
    # celery_app.worker_main(args)
    app.extensions["celery"] = celery_app
    return celery_app

def start_celery_app(app: Flask) -> Celery:
    celery_app = celery_init_app(app)
    return celery_app

def get_available_cores():
    try:
        return os.cpu_count() or multiprocessing.cpu_count()
    except (AttributeError, NotImplementedError):
        return 1  # Default to 1 if unable to determine

# Start celery worker with name
def start_celery_workers(worker_name: str) -> None:
    available_cores = get_available_cores()
    if available_cores == 1:
        nicelogger.log("[*] WARNING: This machine has only 1 core available!")
    else: 
        if available_cores > 1:
            available_cores -= 1
        
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    log_file_name = f"{worker_name}_{timestamp}.log"
    log_formatter = logging.Formatter(
        "%(asctime)s [%(levelname)s] %(message)s",
        "%Y-%m-%dT%H:%M:%SZ"
    )
    log_handler = logging.FileHandler(log_file_name)
    log_handler.setFormatter(log_formatter)
    log_handler.setLevel(logging.INFO)
    logging.root.addHandler(log_handler)
    # Set up the command-line arguments
    args = [
        "celery", "multi", "start",
        "worker", "-A", "celery",
        "-Q", f"queue_{worker_name}",  # Specify queue name
        "--concurrency", str(available_cores),  # Adjust the concurrency as needed
        "--loglevel", "info",
        "--logfile", "celery.log",
        "--pidfile", f"pidfile_{worker_name}.pid",  # Specify a pid file per worker
    ]

    # Start the Celery workers
    subprocess.run(args)
    return jsonify({'message': 'Workers started'}) # type: ignore

def get_running_workers(worker_name):
    running_workers = []

    for process in psutil.process_iter(attrs=['pid', 'name', 'cmdline']):
        try:
            process_name = process.info['name'] # type: ignore
            cmdline = process.info['cmdline'] # type: ignore
            if process_name == 'celery' and cmdline and cmdline[1] == 'multi' and cmdline[2] == 'start':
                if worker_name in cmdline:
                    running_workers.append(process)
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass

    return running_workers

def stop_celery_worker(worker_name: str) -> None:
    for process in psutil.process_iter(attrs=['pid', 'name', 'cmdline']):
        try:
            process_name = process.info['name']
            cmdline = process.info['cmdline']
            if process_name == 'celery' and cmdline and cmdline[1] == 'multi' and cmdline[2] == 'start':
                if worker_name in cmdline:
                    process_pid = process.info['pid']
                    psutil.Process(process_pid).terminate()
                    print(f"Stopped {worker_name} worker with PID {process_pid}")
                    return
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass

    print(f"No running {worker_name} workers found.")