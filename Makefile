include .env.pypi

NIKAS_JS_SRC := $(shell find nikas/js/app -type f) \
	       $(shell ls nikas/js/*.js | grep -vE "(min|dev)") \
	       nikas/js/lib/requirejs-jade/jade.js

NIKAS_JS_DST := nikas/js/embed.min.js nikas/js/embed.dev.js \
	       nikas/js/count.min.js nikas/js/count.dev.js

NIKAS_CSS := nikas/css/nikas.css

NIKAS_PY_SRC := $(shell git ls-files | grep -E "^nikas/.+.py$$")

RJS = r.js

SASS = node-sass

init:
	(cd nikas/js; bower --allow-root install almond requirejs requirejs-text jade)

flakes:
	flake8 . --count --max-line-length=127 --show-source --statistics

nikas/js/%.min.js: $(NIKAS_JS_SRC) $(NIKAS_CSS)
	$(RJS) -o nikas/js/build.$*.js out=$@

nikas/js/%.dev.js: $(NIKAS_JS_SRC) $(NIKAS_CSS)
	$(RJS) -o nikas/js/build.$*.js optimize="none" out=$@

js: $(NIKAS_JS_DST)

sass:
	gulp sass

coverage: $(NIKAS_PY_SRC)
	nosetests --with-doctest --with-coverage --cover-package=nikas --cover-html nikas/

test: $(NIKAS_PY_SRC)
	python3 setup.py nosetests

clean:
	rm -f $(NIKAS_JS_DST)

.PHONY: clean site man init js coverage test

pypi:
	python3 setup.py sdist bdist_wheel
	twine check dist/*
	@-twine upload --repository-url https://test.pypi.org/legacy/ -u hatamiarash7 -p $(PYPI_TEST_PASSWORD) dist/*
	@-twine upload -u __token__ -p $(PYPI_TOKEN) dist/*