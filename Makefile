lib = lib
test = test
node_modules = node_modules

mocha = $(node_modules)/.bin/mocha
jshint = $(node_modules)/.bin/jshint

all: lint $(test)
.PHONY: all

lint:
	$(jshint) $(lib) $(test) index.js
.PHONY: lint

$(test):
	$(mocha) --recursive $@
.PHONY: $(test)
