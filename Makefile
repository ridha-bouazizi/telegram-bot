# Define phony targets to avoid conflicts with files of the same names
.PHONY: build up up-live down restart logs stop clean logs-web logs-celery logs-redis logs-flower help create-volumes create-networks

# Build Docker images
build:
	docker-compose build

# Start services in detached mode
up:
	docker-compose up -d

# Start services without detached mode
up-live:
	docker-compose up

# Start utility services without detached mode
up-utils:
	docker-compose up -d redis flower

# Start utility services without detached mode
up-utils-live:
	docker-compose up redis flower

# Stop utility services
down-utils:
	docker-compose stop redis flower

# Stop and remove services
down:
	docker-compose down

# Restart services
restart:
	docker-compose restart

# Show logs for all services
logs:
	docker-compose logs -f

# Show live logs for the web service
logs-web:
	docker-compose logs -f web

# Show live logs for the celery service
logs-celery:
	docker-compose logs -f celery

# Show live logs for the redis service
logs-redis:
	docker-compose logs -f redis

# Show live logs for the flower service
logs-flower:
	docker-compose logs -f flower

# Stop services
stop:
	docker-compose stop

# Stop and remove services, volumes, and orphaned containers
clean:
	docker-compose down -v --remove-orphans

# Create external volumes and networks
create-volumes:
	docker volume create redis_data
	docker volume create flower_data

create-networks:
	docker network create tgb_bot_network

# Display help information
help:
	@echo "Usage: make <target>"
	@echo ""
	@echo "Available targets:"
	@echo "  build           Build Docker images"
	@echo "  up              Start services in detached mode"
	@echo "  up-live         Start services without detached mode"
	@echo "  down            Stop and remove services"
	@echo "  restart         Restart services"
	@echo "  logs            Show logs for all services"
	@echo "  logs-web        Show live logs for the web service"
	@echo "  logs-celery     Show live logs for the celery service"
	@echo "  logs-redis      Show live logs for the redis service"
	@echo "  logs-flower     Show live logs for the flower service"
	@echo "  stop            Stop services"
	@echo "  clean           Stop and remove services, volumes, and orphaned containers"
	@echo "  create-volumes  Create external volumes"
	@echo "  create-networks Create external networks"
	@echo "  help            Display this help message"
