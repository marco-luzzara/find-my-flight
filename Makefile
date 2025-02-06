SHELL=/bin/bash
JEST_TESTS ?= .*\.test\.(?:t|j)s
.PHONY: compile-api start-api compile-webapp start-webapp test clean

compile-api:
	cd packages/api && \
		npx tsc -b tsconfig.json tsconfig.compile.json

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
	npx jest "$(JEST_TESTS)"

clean:
	npx tsc --build --clean