SHELL=/bin/bash
JEST_REGEX ?= .*\.test\.(?:t|j)s
NPM_WORKSPACE_NAME := @findmyflight/api
PRJ_FOLDER := packages/api


.PHONY: api/install
api/install: global/install
	npm ci --include=dev --workspace="${NPM_WORKSPACE_NAME}" --include-workspace-root=true


.PHONY: api/build
api/build:
	npm run build --workspace="${NPM_WORKSPACE_NAME}"
	cd ${PRJ_FOLDER} && npx eslint src/ test/


.PHONY: api/run
api/run: api/build
	cd ${PRJ_FOLDER} && \
		npx node dist/app.js
        