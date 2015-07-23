var angularMeteorTemplate = angular.module('angular-meteor.template', []);

angularMeteorTemplate.run(['$templateCache',
  function ($templateCache) {
    angular.forEach(Template, function (template, name) {
      if (
        name.charAt(0) != "_"  &&
        name != "prototype"  &&
        name != "loginButtons" &&
        name != "instance"  &&
        name != "currentData"  &&
        name != "parentData"  &&
        name != "body"  &&
        name != "registerHelper") { // Ignores templates with names starting with "_"

          $templateCache.put(name, '<ng-template name="' + name + '"></ng-template>');
      }
    });
  }
]);

angularMeteorTemplate.directive('ngTemplate', [
  function () {
    return {
      restrict: 'E',
      scope: false,
      template: function (element, attributes) {
        return Blaze.toHTML(Template[attributes.name]);
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
          var viewHandler = Blaze.renderWithData(template, scope, element[0]);
          $compile(element.contents())(scope);
          scope.$on('$destroy', function() {
            Blaze.remove(viewHandler);
          });
        } else {
          console.error("meteorTemplate: There is no template with the name '" + name + "'");
        }
      }
    };
  }
]);