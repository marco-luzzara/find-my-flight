.PHONY: compile test start


compile:
	npx tsc && npx next lint

start: compile
	npm start

test: compile
	npx jest