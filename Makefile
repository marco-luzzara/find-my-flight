SHELL=/bin/bash


.PHONY: global/install
global/install:
	#npm ci


-include make-tasks/Makefile.*


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