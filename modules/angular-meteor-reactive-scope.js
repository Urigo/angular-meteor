/**
 * Created by netanel on 29/12/14.
 */
var angularMeteorReactiveScope = angular.module('angular-meteor.reactive-scope', []);

angularMeteorReactiveScope.run(['$rootScope', function($rootScope) {
  Object.getPrototypeOf($rootScope).getReactively = function(property) {
    var self = this;

    if (!self.$$trackerDeps) {
      self.$$trackerDeps = {};
    }

    if (!self.$$trackerDeps[property]) {
      self.$$trackerDeps[property] = new Tracker.Dependency();

      self.$watch(function() {
        return self[property]
      }, function() {
        self.$$trackerDeps[property].changed();
      });
    }

    self.$$trackerDeps[property].depend();

    return self[property];
  };
}]);
