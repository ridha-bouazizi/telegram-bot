#!/bin/bash

# Install Poetry dependencies
poetry install

# Check if a command is provided when running the container
if [ "$1" = "celery" ]; then
    # Run Celery workers
    poetry run celery -A app.celery worker --loglevel=debug
else
    # Run your Flask app
    poetry run flask --debug run -h 0.0.0.0 
fi