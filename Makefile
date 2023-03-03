install:
	npm ci

lint:
	npx eslint .

develop:
	npx webpack serve

production:
	rm -rf dist
	NODE_ENV=production npx webpack

test:
	npm test