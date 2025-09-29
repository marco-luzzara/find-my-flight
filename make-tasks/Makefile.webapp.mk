SHELL=/bin/bash
JEST_REGEX ?= .*\.test\.(?:t|j)s


.PHONY: webapp/build
webapp/build:
	npx tsc --build
	cd packages/webapp && \
		npx next lint


.PHONY: webapp/run
webapp/run: webapp/build
	cd packages/webapp && \
		source .env && \
		npx next dev -p "$$SERVER_PORT"
        