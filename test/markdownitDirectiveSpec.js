/*global describe,it,should,beforeEach,module,expect*/

describe('angular-markdown-it:directive', function() {
  'use strict';

  var $compile;
  var $rootScope;

  beforeEach(module('mdMarkdownIt'));
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

describe('directive with custom plugin object', function() {

  var $compile;
  var $rootScope;

  angular.module('emojiDirectiveTest', ['mdMarkdownIt']).config([
    'markdownItConverterProvider', function(markdownItConverter) {
      markdownItConverter.use(markdownitEmoji);
    }
  ]);

  beforeEach(module('emojiDirectiveTest'));
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should emojify an element', function() {
    var elt = angular.element('<markdown-it>:)</markdown-it>');
    $compile(elt)($rootScope);
    expect(elt.html()).toContain('<p>😃</p>');
  });

  it('should emojify an attribute', function() {
    var elt = angular.element('<div markdown-it>:)</div>');
    $compile(elt)($rootScope);
    expect(elt.html()).toContain('<p>😃</p>');
  });

});
