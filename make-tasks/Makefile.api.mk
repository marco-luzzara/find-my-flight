SHELL=/bin/bash
JEST_REGEX ?= .*\.test\.(?:t|j)s
PRJ_FOLDER := packages/api


.PHONY: api/install
api/install:
	cd ${PRJ_FOLDER} && npm ci --include=dev


.PHONY: api/build
api/build:
	cd ${PRJ_FOLDER} && \
		npx tsc -b tsconfig.json tsconfig.compile.json


.PHONY: api/run
api/run: api/build
	cd ${PRJ_FOLDER} && \
		npx node dist/app.js
        