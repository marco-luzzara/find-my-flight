SERVER_PORT ?= 3001
.PHONY: compile test start


compile:
	npx tsc --build
	cd packages/webapp && npx next lint

start: compile
	cd packages/webapp && npx next dev -p $(SERVER_PORT)

test: compile
	npx jest