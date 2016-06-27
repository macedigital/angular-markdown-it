/*global describe,it,should,beforeAll,afterAll,beforeEach,afterEach,module,expect*/

describe('angular-markdown-it:provider', function() {
  'use strict';

  var $compile;
  var $rootScope;

  describe('with unavailable markdownit', function() {

    var backup;
    var $log;

    angular.module('undefinedMarkdownIt', ['mdMarkdownIt']);

    beforeAll(function() {
      backup = window.markdownit;
      window.markdownit = undefined;
    });

    afterAll(function() {
      window.markdownit = backup;
      backup = undefined;
    });

    beforeEach(module('undefinedMarkdownIt'));
    beforeEach(inject(function(_$compile_, _$rootScope_, _$log_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $log = _$log_;
    }));

    it('should log error and throw exception', function() {

      expect(window.markdownit).toBeUndefined();
      expect($log.error.logs.length).toEqual(0);

      try {
        var elt = angular.element('<markdown-it>fails due to missing library</markdown-it>');
        $compile(elt)($rootScope);
      } catch (e) {
        expect(e.name).toBe('TypeError');
      }

      expect($log.error.logs.length).toEqual(1);
      expect($log.error.logs[0].toString()).toContain('markdown-it library not loaded');

    });

  });

  describe('with invalid config', function() {

    angular.module('invalidConfigModule', ['mdMarkdownIt'])
      .config([
        'markdownItConverterProvider', function(markdownItConverter) {
          markdownItConverter.config(null, false);
        }
      ]);

    beforeEach(module('invalidConfigModule'));
    beforeEach(inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));

    it('should fallback to defaults', function() {
      var elt = angular.element('<markdown-it># headline</markdown-it>');
      $compile(elt)($rootScope);
      expect(elt.html()).toContain('<h1>headline</h1>');
    });

  });

  describe('with invalid presetname', function() {

    angular.module('invalidPresetModule', ['mdMarkdownIt'])
      .config([
        'markdownItConverterProvider', function(markdownItConverter) {
          markdownItConverter.config(null);
        }
      ]);

    beforeEach(module('invalidPresetModule'));
    beforeEach(inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));

    it('should fallback to defaults', function() {
      var elt = angular.element('<markdown-it># headline</markdown-it>');
      $compile(elt)($rootScope);
      expect(elt.html()).toContain('<h1>headline</h1>');
    });

  });

  describe('with custom config object', function() {

    angular.module('testModule', ['mdMarkdownIt']).config([
        'markdownItConverterProvider', function(markdownItConverter) {
          markdownItConverter.config({
            linkify: true,
            html: true,
            breaks: true
          });
        }
      ]);

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

  describe('with "zero" preset only', function() {

    angular.module('presetModule', ['mdMarkdownIt']).config([
      'markdownItConverterProvider', function(markdownItConverter) {
        markdownItConverter.config('zero');
      }
    ]);

    beforeEach(module('presetModule'));
    beforeEach(inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));

    it('should not even apply strong and italic rules', function() {
      var elt = angular.element('<markdown-it>*italic* and **strong**</markdown-it>');
      $compile(elt)($rootScope);
      expect(elt.html()).toContain('<p>*italic* and **strong**</p>');
    });

    it('should not linkify urls', function() {
      var elt = angular.element('<markdown-it>https://github.com/</markdown-it>');
      $compile(elt)($rootScope);
      expect(elt.html()).toContain('<p>https://github.com/</p>');
    });

    it('should not convert linebreaks to <br>-tags', function() {
      var elt = angular.element('<div markdown-it>1\n2\n3</div>');
      $compile(elt)($rootScope);
      expect(elt.html()).toContain('<p>1\n2\n3</p>');
    });

    it('should escape html elements in markdown', function() {
      var elt = angular.element('<p markdown-it="html"></p>');
      var html = '<aside><p>hello html</p></aside>';
      $compile(elt)($rootScope);
      $rootScope.html = html;
      $rootScope.$apply();
      expect(elt.html()).toContain('<p>&lt;aside&gt;&lt;p&gt;hello html&lt;/p&gt;&lt;/aside&gt;</p>');
    });

  });

  describe('with "commonmark" preset and config object', function() {

    angular.module('presetConfigModule', ['mdMarkdownIt']).config([
      'markdownItConverterProvider', function(markdownItConverter) {
        markdownItConverter.config('commonmark', {
          linkify: true,
          html: true,
          breaks: true
        });
      }
    ]);

    beforeEach(module('presetConfigModule'));
    beforeEach(inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));

    it('should not linkify urls', function() {
      var elt = angular.element('<markdown-it>https://github.com/</markdown-it>');
      $compile(elt)($rootScope);
      expect(elt.html()).toContain('<p>https://github.com/</p>');
    });

    it('should render markdown format links', function() {
      var elt = angular.element('<markdown-it>[github.com](https://github.com/)</markdown-it>');
      $compile(elt)($rootScope);
      expect(elt.html()).toContain('<p><a href="https://github.com/">github.com</a></p>');
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

  describe('markdownItConverter with plugins', function() {

    var markdownItConverter;

    angular.module('pluginModule', ['mdMarkdownIt']);

    beforeEach(module('pluginModule'));
    beforeEach(inject(function(_markdownItConverter_) {
      markdownItConverter = _markdownItConverter_;
    }));

    afterEach(function() {
      markdownItConverter = null;
    });

    it('should render with emoji plugin', function() {

      expect(markdownItConverter.renderer.rules.emoji).toBeUndefined();
      expect(markdownItConverter.renderInline(':(')).toEqual(':(');

      markdownItConverter.use(markdownitEmoji);

      expect(markdownItConverter.renderer.rules.emoji).toBeTruthy();
      expect(markdownItConverter.renderInline(':)')).toEqual('😃');

    });

    it('should use custom plugin options', function() {
      markdownItConverter.use(markdownitEmoji, {
        'smile': [':)', ':-)'],
        'laughing': ':D'
      });

      expect(markdownItConverter.renderInline(':-)')).toEqual('😃');
      expect(markdownItConverter.renderInline(':D')).toEqual('😄');
      expect(markdownItConverter.renderInline(':@')).toEqual('😡');

    });

    it('should allow monkey-patching', function() {

      markdownItConverter.use(markdownitEmoji);
      markdownItConverter.renderer.rules.emoji = function(token, idx) {
        return '<span class="emoji emoji_' + token[idx].markup + '"></span>';
      };
      expect(markdownItConverter.renderInline(':)')).toEqual('<span class="emoji emoji_smiley"></span>');

    });

    it('should be able to add plugins (fluent-style)', function() {

      expect(markdownItConverter.renderInline(':-P H~2~0')).toEqual(':-P H~2~0');
      markdownItConverter.use(markdownitSub).use(markdownitEmoji);
      expect(markdownItConverter.renderInline(':-P H~2~0')).toEqual('😛 H<sub>2</sub>0');

    });

  });

});
