SHELL=/bin/bash
JEST_REGEX ?= .*\.test\.(?:t|j)s
NPM_WORKSPACE_NAME := @findmyflight/api

include make-tasks/Makefile.common.mk

# ------------------ BEGIN DEV
.PHONY: api/dev-install
api/dev-install:
	$(check-dev-env)
	npm ci --include=dev --workspace="${NPM_WORKSPACE_NAME}" --include-workspace-root=true


.PHONY: api/dev-build
api/dev-build:
	$(check-dev-env)
	npm run build --workspace="${NPM_WORKSPACE_NAME}"


.PHONY: api/dev-run
api/dev-run: api/dev-build
	$(check-dev-env)
	npm run start --workspace="${NPM_WORKSPACE_NAME}"
# ------------------ END DEV

# ------------------ BEGIN PROD
# Parameters: \
PORT: the port exposed on the host for the server
.PHONY: api/run
api/run:
	PORT=${PORT} docker compose -f docker/api/docker-compose.yaml up --build -d
# ------------------ END PROD
