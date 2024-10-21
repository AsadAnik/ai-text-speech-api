build:
	docker-compose build

build-no-cache:
	docker-compose build --no-cache

up:
	docker-compose up -d

up-dev:
	docker-compose up

down:
	docker-compose down

up-rmq:
	docker-compose up rabbitmq

restart-rmq:
	docker-compose restart rabbitmq

down-rmq:
	docker-compose down rabbitmq