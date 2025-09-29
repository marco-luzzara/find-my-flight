-include make-tasks/Makefile.*


.PHONY: compile-api
compile-api:
	cd packages/api && \
		npx tsc -b tsconfig.json tsconfig.compile.json


.PHONY: start-api
start-api: compile-api
	cd packages/api && \
		npx node dist/app.js


.PHONY: compile-webapp
compile-webapp:
	npx tsc --build
	cd packages/webapp && \
		npx next lint


.PHONY: start-webapp
start-webapp: compile-webapp
	cd packages/webapp && \
		source .env && \
		npx next dev -p "$$SERVER_PORT"


.PHONY: test
test: compile-api compile-webapp
	npx jest "$(JEST_REGEX)"


.PHONY: clean
clean:
	npx tsc --build --clean