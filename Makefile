.PHONY: test

test:
	npx tsc && NODE_OPTIONS="$$NODE_OPTIONS --experimental-vm-modules" npx jest