'use strict';
var angularMeteorSession = angular.module('angular-meteor.session', ['angular-meteor.utils']);

angularMeteorSession.factory('$meteorSession', ['$meteorUtils',
  function ($meteorUtils) {
    return function (session) {

      return {

        bind: function(scope, model) {
          $meteorUtils.autorun(scope, function() {
            scope[model] = Session.get(session);
          });

          scope.$watch(model, function (newItem, oldItem) {
            Session.set(session, scope[model]);
          }, true);

        }
      };
    }
  }
]);

