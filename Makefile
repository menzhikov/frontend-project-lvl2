install: install-deps

install-deps:
	npm ci

start:
	npx babel-node src/bin/gendiff.js before.json after.json

publish:
	npm publish --dry-run

lint:
	npx eslint .

build:
	rm -rf dist
	npm run build

test:
	npm test -- --watch

test-coverage:
	npm test -- --coverage