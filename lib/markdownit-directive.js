'use strict';

angular.module('macedigital.markdownit', ['ngSanitize'])
  .provider('markdownItConverter', function() {

    var defaults = {};

    return {
      config: function(options) {
        defaults = options;
      },
      $get: function() {
        return markdownit(defaults);
      }
    };
  })
  .directive('markdownIt', ['$sanitize', 'markdownItConverter', function($sanitize, markdownItConverter) {

    var render = function(value) {
      return $sanitize(markdownItConverter.render(value));
    };

    var link = function(scope, element, attrs) {
      var html = '';

      if (attrs.markdownIt) {
        scope.$watch('markdownIt', function(value) {
          html = value ? render(value) : '';
          element.html(html);
        });
      } else {
        html = render(element.text());
        element.html(html);
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
  }]);
