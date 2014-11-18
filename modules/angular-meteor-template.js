var angularMeteorTemplate = angular.module('angular-meteor.template', []);

angularMeteorTemplate.run(['$templateCache',
  function ($templateCache) {
    angular.forEach(Template, function (template, name) {
      if (name.charAt(0) != "_"  && name != "prototype"  && name != "loginButtons") { // Ignores templates with names starting with "_"
        $templateCache.put(name, '<ng-template name="' + name + '"></span>');
      }
    });
  }
]);

angularMeteorTemplate.directive('ngTemplate', ['$templateCache',
  function ($templateCache) {
    return {
      restrict: 'E',
      scope: false,
      template: function (element, attributes) {

        // Check if version prior 0.8.3
        if (Template[attributes.name].render){
          var name = attributes.name,
            template = Template[name],
            templateRender = Blaze.toHTML(template),
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
        } else {
          return Blaze.toHTML(Template[attributes.name]);
        }
      },
      link: function (scope, element, attributes) {
        var name = attributes.name,
          template = Template[name];

        /**
         * Includes the templates event maps.
         * Attaching events using selectors is not the recommended approach taken by AngularJS.
         * That being said, the template event maps are included to maintain flexibility in the Meteor + Angular integration.
         * It is not angular-meteor's role to dictate which approach a developer should take,
         * so angular-meteor has left it up to the user to decide which approach they prefer when developing.
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

angularMeteorTemplate.directive('meteorInclude', [
  '$compile',
  function ($compile) {
    return {
      restrict: 'AE',
      scope: false,
      link: function (scope, element, attributes) {
        var name = attributes.meteorInclude || attributes.src;
        if (name && Template[name]) {
          var template = Template[name];
          Blaze.renderWithData(template, scope, element.get(0));
          $compile(element.contents())(scope);
        } else {
          console.error("meteorTemplate: There is no template with the name '" + name + "'");
        }
      }
    };
  }
]);
