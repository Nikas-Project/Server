include .env.pypi

JS_SRC := $(shell find nikas/js/app -type f) \
	       $(shell ls nikas/js/*.js | grep -vE "(min|dev)")

JS_DST := nikas/js/embed.min.js nikas/js/embed.dev.js \
	       nikas/js/count.min.js nikas/js/count.dev.js \
	       nikas/js/count.dev.js.map nikas/js/embed.dev.js.map

PY_SRC := $(shell git ls-files | grep -E "^nikas/.+.py$$")

init:
	npm install -f

flakes:
	flake8 nikas/ --count --max-line-length=127 --show-source --statistics

nikas/js/%.min.js: $(JS_SRC)
	npm run build-prod

nikas/js/%.dev.js: $(JS_SRC)
	npm run build-dev

js: $(JS_DST)

sass:
	gulp sass

coverage: $(PY_SRC)
	coverage run --omit='*/tests/*' --source nikas -m pytest
	coverage report --omit='*/tests/*'

test: $(PY_SRC)
	pytest --doctest-modules nikas/

clean:
	rm -f $(JS_DST)

.PHONY: clean init js coverage test

pypi:
	python3 setup.py sdist bdist_wheel
	@-twine upload --repository-url https://test.pypi.org/legacy/ -u hatamiarash7 -p $(PYPI_TEST_PASSWORD) dist/*
	@-twine upload -u __token__ -p $(PYPI_TOKEN) dist/*
