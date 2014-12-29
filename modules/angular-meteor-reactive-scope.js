/**
 * Created by netanel on 29/12/14.
 */
var angularMeteorReactiveScope = angular.module('angular-meteor.reactive-scope', []);

angularMeteorReactiveScope.run(['$rootScope', function($rootScope) {
  Object.getPrototypeOf($rootScope).getReactivly = function(property) {
    var self = this;

    if (!self.trackerDeps) {
      self.trackerDeps = {};
    }

    if (!self.trackerDeps[property]) {
      self.trackerDeps[property] = new Tracker.Dependency();
      self.trackerDeps[property].depend();


      self.$watch(function() {
        return this[property]
      }, function() {
        self.trackerDeps[property].changed();
      });
    }

    return this[property];
  };
}]);