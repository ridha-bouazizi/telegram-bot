FROM python:latest

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
# apt install clang lib{jpeg-turbo,webp}-dev python{,-dev} zlib-dev
RUN pip install poetry

WORKDIR /tgb_bot

# Copy the entrypoint script into the container
COPY entrypoint.sh /entrypoint.sh

EXPOSE 5000

# Make the entrypoint script executable
RUN chmod +x /entrypoint.sh

# Define the entrypoint command
ENTRYPOINT ["/entrypoint.sh"]