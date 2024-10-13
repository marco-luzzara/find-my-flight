SHELL=/bin/bash
.PHONY: compile-api start-api compile-webapp start-webapp test

compile-api:
	cd packages/api && \
		npx tsc -b

start-api: compile-api
	cd packages/api && \
		npx node dist/app.js

compile-webapp:
	npx tsc --build
	cd packages/webapp && \
		npx next lint

start-webapp: compile-webapp
	cd packages/webapp && \
		source .env && \
		npx next dev -p "$$SERVER_PORT"

test: compile-api compile-webapp
	npx jest