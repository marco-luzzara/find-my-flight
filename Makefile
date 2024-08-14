.PHONY: compile test start


compile:
	npx tsc

start: compile
	npm start

test: compile
	npx jest