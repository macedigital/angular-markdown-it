
.PHONY:
dist:
	mkdir -p dist
	rm dist/* -Rf 
	cp lib/markdownit-directive.js dist/ng-markdownit.js
	node_modules/.bin/uglifyjs -c -m --screw-ie8 --source-map dist/ng-markdownit.min.js.map --source-map-url ng-markdownit.min.js.map -o dist/ng-markdownit.min.js lib/markdownit-directive.js


