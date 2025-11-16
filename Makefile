SHELL=/bin/bash

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
test: api/dev-build #compile-webapp
	NODE_OPTIONS="$$NODE_OPTIONS --experimental-vm-modules" npx jest --detectOpenHandles "$(JEST_REGEX)"


.PHONY: clean
clean:
	npx tsc --build --clean