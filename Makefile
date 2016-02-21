
.PHONY: clean dist

clean:
	rm dist -Rf && rm coverage -Rf

dist: clean
	npm run-script test-cov
	mkdir -p dist
	node_modules/.bin/uglifyjs -b=indent_level=2,quote_style=1,max_line_len=120 --screw-ie8 -o dist/ng-markdownit.js lib/markdownit-directive.js
	node_modules/.bin/uglifyjs -c -m --screw-ie8 --source-map dist/ng-markdownit.min.js.map --source-map-url ng-markdownit.min.js.map -o dist/ng-markdownit.min.js lib/markdownit-directive.js


