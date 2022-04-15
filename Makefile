include .env.pypi

NIKAS_JS_SRC := $(shell find nikas/js/app -type f) \
	       $(shell ls nikas/js/*.js | grep -vE "(min|dev)") \
	       nikas/js/lib/requirejs-jade/jade.js

NIKAS_JS_DST := nikas/js/embed.min.js nikas/js/embed.dev.js \
	       nikas/js/count.min.js nikas/js/count.dev.js

NIKAS_CSS := nikas/css/nikas.css

NIKAS_PY_SRC := $(shell git ls-files | grep -E "^nikas/.+.py$$")

RJS = r.js

SASS = sassc

init:
	npm install -f

flakes:
	flake8 nikas/ --count --max-line-length=127 --show-source --statistics

nikas/js/%.min.js: $(NIKAS_JS_SRC)
	npm run build-prod

nikas/js/%.dev.js: $(NIKAS_JS_SRC)
	npm run build-dev

js: $(NIKAS_JS_DST)

sass:
	gulp sass

coverage: $(NIKAS_PY_SRC)
	coverage run --omit='*/tests/*' --source nikas -m pytest
	coverage report --omit='*/tests/*'

test: $(NIKAS_PY_SRC)
	pytest --doctest-modules nikas/

clean:
	rm -f $(NIKAS_JS_DST)

.PHONY: clean init js coverage test

pypi:
	python3 setup.py sdist bdist_wheel
	@-twine upload --repository-url https://test.pypi.org/legacy/ -u hatamiarash7 -p $(PYPI_TEST_PASSWORD) dist/*
	@-twine upload -u __token__ -p $(PYPI_TOKEN) dist/*
