var ngMeteorTemplate = angular.module('ngMeteor.template', []);

ngMeteorTemplate.run(['$templateCache',
  function ($templateCache) {
    angular.forEach(Template, function (template, name) {
      if (name.charAt(0) != "_") { // Ignores templates with names starting with "_"
        $templateCache.put(name, '<ng-template name="' + name + '"></span>');
      }
    });
  }
]);

ngMeteorTemplate.directive('ngTemplate', ['$templateCache',
  function ($templateCache) {
    return {
      restrict: 'E',
      scope: true,
      template: function (element, attributes) {
        var name = attributes.name,
          template = Template[name],
          templateRender = template.render(),
          templateString = null;

        // Check for nested templates in the render object and replace them with the equivalent ngTemplate directive.
        angular.forEach(templateRender, function (v, k) {
          if (angular.isObject(v)) {
            if (v._super) {
              var transcludeTemplateName = v._super.kind.replace('Template_', '');
              templateRender[k] = new HTML.Raw($templateCache.get(transcludeTemplateName));
            }
          }
        });

        if (angular.isDefined(template)) {
          templateString = UI.toHTML(templateRender);
        } else {
          throw new ReferenceError("There is no Meteor template with the name '" + name + "'.");
        }

        return templateString;
      },
      link: function (scope, element, attributes) {
        var name = attributes.name,
          template = Template[name];

        /**
         * Includes the templates event maps.
         * Attaching events using selectors is not the recommended approach taken by AngularJS.
         * That being said, the template event maps are included to maintain flexibility in the Meteor + Angular integration.
         * It is not ngMeteor's role to dictate which approach a developer should take,
         * so ngMeteor has left it up to the user to decide which approach they prefer when developing.
         **/
        angular.forEach(template._events, function (eventObj) {
          var eventType = eventObj.events,
            eventSelector = eventObj.selector,
            eventHandler = eventObj.handler;

          // Test all eventType to see if there is an equivalent in jQuery.

          $('ng-template[name="' + name + '"] ' + eventSelector + '').bind(eventType, eventHandler);
        });

      }
    };
  }
]);