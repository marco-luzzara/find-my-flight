SERVER_PORT ?= 3001
.PHONY: compile test start


compile:
	npx tsc && npx next lint

start: compile
	npx next dev -p $(SERVER_PORT)

test: compile
	npx jest