/**
 * Created by netanel on 29/12/14.
 */
var angularMeteorReactiveScope = angular.module('angular-meteor.reactive-scope', []);

angularMeteorReactiveScope.run(['$rootScope', '$parse', function($rootScope, $parse) {
  Object.getPrototypeOf($rootScope).getReactively = function(property) {
    var self = this;
    var getValue = $parse(property);

    if (!self.$$trackerDeps) {
      self.$$trackerDeps = {};
    }

    if (!self.$$trackerDeps[property]) {
      self.$$trackerDeps[property] = new Tracker.Dependency();

      self.$watch(function() {
        return getValue(self)
      }, function() {
        self.$$trackerDeps[property].changed();
      });
    }

    self.$$trackerDeps[property].depend();

    return getValue(self);
  };
}]);
