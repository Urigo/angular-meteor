'use strict';
var angularMeteorSession = angular.module('angular-meteor.session', ['angular-meteor.utils']);

angularMeteorSession.factory('$meteorSession', ['$meteorUtils', '$parse',
  function ($meteorUtils, $parse) {
    return function (session) {

      return {

        bind: function(scope, model) {
          console.warn('[angular-meteor.session.bind] Please note that this method is deprecated since 1.3.0 and will be removed in 1.4.0! http://www.angular-meteor.com/api/1.3.0/session');

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

