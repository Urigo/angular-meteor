'use strict';
var angularMeteorSession = angular.module('angular-meteor.session', ['angular-meteor.utils']);

angularMeteorSession.factory('$meteorSession', ['$meteorUtils', '$parse',
  function ($meteorUtils, $parse) {
    return function (session) {

      return {

        bind: function(scope, model) {
          var getter = $parse(model);
          var setter = getter.assign;
          $meteorUtils.autorun(scope, function() {
            setter(scope, Session.get(session));
          });

          scope.$watch(model, function(newItem, oldItem) {
            Session.set(session, getter(scope));
          }, true);

        }
      };
    }
  }
]);

