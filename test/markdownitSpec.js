/*global describe,it,should,beforeEach,module*/
'use strict';

describe('angular-markdown-it:directive', function() {
  var $compile;
  var $rootScope;

  beforeEach(module('macedigital.markdownit'));
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should work as an element', function() {
    var elt = angular.element('<markdown-it>*hi*</markdown-it>');
    $compile(elt)($rootScope);
    expect(elt.html()).toContain('<p><em>hi</em></p>');
  });

  it('should work as an attribute', function() {
    var elt = angular.element('<div markdown-it>*hi*</div>');
    $compile(elt)($rootScope);
    expect(elt.html()).toContain('<p><em>hi</em></p>');
  });

  it('should work as an attribute with property', function() {
    var elt = angular.element('<div markdown-it="hey"></div>');
    $compile(elt)($rootScope);
    expect(elt.html()).toBe('');

    $rootScope.hey = '*hi*';
    $rootScope.$apply();
    expect(elt.html()).toContain('<p><em>hi</em></p>');
  });

  it('should fallback to empty string with falsy values', function() {
    var elt = angular.element('<div markdown-it="hey"></div>');
    $compile(elt)($rootScope);
    expect(elt.html()).toBe('');

    $rootScope.hey = false;
    $rootScope.$digest();
    expect(elt.html()).toBe('');
  });

  it('should sanitize when used as a element', function() {
    var elt = angular.element('<markdown-it><script>window.hacked = true;</script></markdown-it>');
    $compile(elt)($rootScope);
    expect(elt.html()).toContain('<p>window.hacked = true;</p>');
    expect(window.hacked).toBeUndefined();
  });

  it('should sanitize when used as an attribute', function() {
    var elt = angular.element('<p markdown-it><script>window.hacked = true;</script></p>');
    $compile(elt)($rootScope);
    expect(elt.html()).toContain('<p>window.hacked = true;</p>');
    expect(window.hacked).toBeUndefined();
  });
});

describe('angular-markdown-it:provider', function() {
  var $compile;
  var $rootScope;

  // module that adds config
  angular.module('testModule', ['macedigital.markdownit'])
    .config(['markdownItConverterProvider', function(markdownItConverter) {
      markdownItConverter.config({
        linkify: true,
        html: true,
        breaks: true
      });
    }]);

  beforeEach(module('testModule'));
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should linkify urls', function() {
    var elt = angular.element('<markdown-it>https://github.com/</markdown-it>');
    $compile(elt)($rootScope);
    expect(elt.html()).toContain('<p><a href="https://github.com/">https://github.com/</a></p>');
  });

  it('should convert linebreaks to <br>-tags', function() {
    var elt = angular.element('<div markdown-it>1\n2\n3</div>');
    $compile(elt)($rootScope);
    expect(elt.html()).toContain('<p>1<br>');
  });

  it('should accept html elements in markdown', function() {
    var elt = angular.element('<p markdown-it="html"></p>');
    var html = '<aside><p>hello html</p></aside>';
    $compile(elt)($rootScope);
    $rootScope.html = html;
    $rootScope.$apply();
    expect(elt.html()).toBe(html);
  });
});
