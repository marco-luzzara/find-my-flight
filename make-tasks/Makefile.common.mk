SHELL=/bin/bash

define check-dev-env =
test "$$NODE_ENV" = "development" || \
	{ echo 'Requirement: run it inside devcontainer' && exit 1; }
endef
