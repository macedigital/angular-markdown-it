(function(window, angular) {
  'use strict';

  function markdownItProvider() {

    var options = {};
    var presetName = 'default';

    return {
      config: function(preset, opts) {
        // fizzbuzz anyone?
        if (angular.isString(preset) && angular.isObject(opts)) {
          presetName = preset;
          options = opts;
        } else if (angular.isString(preset)) {
          presetName = preset;
        } else if (angular.isObject(preset)) {
          options = preset;
        }
      },
      $get: ['$log', function($log) {
        var markdownit = window.markdownit;
        if (angular.isUndefined(markdownit)) {
          $log.error('angular-markdown-it: markdown-it not loaded.');
          return;
        }
        return markdownit(presetName, options);
      }]
    };
  }

  function markdownItDirective($sanitize, markdownIt) {

    var attribute = 'markdownIt';

    var render = function(value) {
      return value ? $sanitize(markdownIt.render(value)) : '';
    };

    var link = function(scope, element, attrs) {
      if (attrs[attribute]) {
        scope.$watch(attribute, function(value) {
          element.html(render(value));
        });
      } else {
        element.html(render(element.text()));
      }
    };

    return {
      restrict: 'AE',
      scope: {
        markdownIt: '='
      },
      replace: true,
      link: link
    };
  }

  angular.module('mdMarkdownIt', ['ngSanitize'])
    .provider('markdownItConverter', markdownItProvider)
    .directive('markdownIt', ['$sanitize', 'markdownItConverter', markdownItDirective]);

})(window, window.angular);
