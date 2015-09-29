![Bower version][bower-image]
[![Build Status][ci-image]][ci-url]
[![Code Coverage status][codecov-image]][codecov-url]

# angular-markdown-it

> [Angular 1.x](https://angularjs.org) directive for rendering markdown with [markdown-it](https://github.com/markdown-it/markdown-it). This directive is based on @btford's [markdown directive](https://github.com/btford/angular-markdown-directive).

## Usage

The easiest way to use the `mdMarkdownIt` directive is to install it with bower:

`bower install angular-markdown-it`

You'll need to load `angular`, `angular-sanitize`, and `markdown-it` which should be located in your `bower_components` folder.

Then, you can include the `markdown-it` directive in your templates:

````html
<markdown-it>
# Hey there!
*It works!*
</markdown-it>
````

You can also bind the markdown input to a scope variable:

````html
<div markdown-it="markdown"></div>
<!-- Uses $scope.markdown -->
````

Or, you include a markdown file:

````html
<div markdown-it ng-include="README.md"></div>
<!-- Uses content from README.md -->
````

## Configuration

You can pass in custom options to the `markdownItConverterProvider` by choosing a preset, and/or custom settings.

````js
angular.module('myModule', ['ngSanitize', 'mdMarkdownIt'])
  .config(['markdownItConverterProvider', function(markdownItConverter) {
      markdownItConverter.config('commonmark', {
        breaks: true,
        html: true
      });
  }])
````

See [markdown-it presets and options](https://github.com/markdown-it/markdown-it#init-with-presets-and-options) for all possible variations.

Support for adding plugins is planned, but not yet supported.

## License

MIT

[bower-image]:https://img.shields.io/bower/v/angular-markdown-it.svg?style=flat
[ci-image]: https://travis-ci.org/macedigital/angular-markdown-it.svg?style=flat
[ci-url]: https://travis-ci.org/macedigital/angular-markdown-it
[codecov-image]:https://img.shields.io/codecov/c/github/macedigital/angular-markdown-it.svg?style=flat
[codecov-url]:https://codecov.io/github/macedigital/angular-markdown-it