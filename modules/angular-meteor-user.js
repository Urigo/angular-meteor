var angularMeteorUser = angular.module('angular-meteor.user', []);

angularMeteorUser.factory("$user", [function() {
  return {
    bind: function(scope, model) {
      Deps.autorun(function(self) {
        scope[model] = Meteor.user();
        if (!scope.$$phase) scope.$apply();
        scope.$on('$destroy', function () {
          self.stop(); // Stop computation if scope is destroyed.
        });
      });
    }
  }
}]);