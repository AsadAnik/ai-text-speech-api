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