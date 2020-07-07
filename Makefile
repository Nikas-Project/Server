# INSTALLATION: pip install sphinx && npm install --global node-sass

NIKAS_JS_SRC := $(shell find nikas/js/app -type f) \
	       $(shell ls nikas/js/*.js | grep -vE "(min|dev)") \
	       nikas/js/lib/requirejs-jade/jade.js

NIKAS_JS_DST := nikas/js/embed.min.js nikas/js/embed.dev.js \
	       nikas/js/count.min.js nikas/js/count.dev.js

NIKAS_CSS := nikas/css/nikas.css

NIKAS_PY_SRC := $(shell git ls-files | grep -E "^nikas/.+.py$$")

DOCS_RST_SRC := $(shell find docs/ -type f -name '*.rst') \
		$(wildcard docs/_nikas/*) \
	        docs/index.html docs/conf.py docs/docutils.conf \
		share/nikas.conf

DOCS_CSS_SRC := docs/_static/css/site.scss

DOCS_CSS_DEP := $(shell find docs/_static/css/neat -type f) \
		$(shell find docs/_static/css/bourbon -type f)

DOCS_CSS_DST := docs/_static/css/site.css

DOCS_MAN_DST := man/man1/nikas.1 man/man5/nikas.conf.5

DOCS_HTML_DST := docs/_build/html

RJS = r.js

SASS = node-sass

all: man js site

init:
	(cd nikas/js; bower --allow-root install almond requirejs requirejs-text jade)

flakes:
	flake8 . --count --max-line-length=127 --show-source --statistics

nikas/js/%.min.js: $(NIKAS_JS_SRC) $(NIKAS_CSS)
	$(RJS) -o nikas/js/build.$*.js out=$@

nikas/js/%.dev.js: $(NIKAS_JS_SRC) $(NIKAS_CSS)
	$(RJS) -o nikas/js/build.$*.js optimize="none" out=$@

js: $(NIKAS_JS_DST)

man: $(DOCS_RST_SRC)
	sphinx-build -b man docs/ man/
	mkdir -p man/man1/ man/man5
	mv man/nikas.1 man/man1/nikas.1
	mv man/nikas.conf.5 man/man5/nikas.conf.5

${DOCS_CSS_DST}: $(DOCS_CSS_SRC) $(DOCS_CSS_DEP)
	$(SASS) --no-cache $(DOCS_CSS_SRC) $@

${DOCS_HTML_DST}: $(DOCS_RST_SRC) $(DOCS_CSS_DST)
	sphinx-build -b dirhtml docs/ $@

site: $(DOCS_HTML_DST)

coverage: $(NIKAS_PY_SRC)
	nosetests --with-doctest --with-coverage --cover-package=nikas --cover-html nikas/

test: $($NIKAS_PY_SRC)
	python3 setup.py nosetests

clean:
	rm -f $(DOCS_MAN_DST) $(DOCS_CSS_DST) $(NIKAS_JS_DST)
	rm -rf $(DOCS_HTML_DST)

.PHONY: clean site man init js coverage test

