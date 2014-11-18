'use strict';
var angularMeteorSession = angular.module('angular-meteor.session', []);

angularMeteorSession.factory('$session', [
  function () {
    return function (session) {

      return {

        bind: function(scope, model) {
          Tracker.autorun(function(self) {
            scope[model] = Session.get(session);
            if (!scope.$root.$$phase) scope.$apply(); // Update bindings in scope.
            scope.$on('$destroy', function () {
              self.stop(); // Stop computation if scope is destroyed.
            });
          });

          scope.$watch(model, function (newItem, oldItem) {
            Session.set(session, scope[model]);
          }, true);

        }
      };
    }
  }
]);

