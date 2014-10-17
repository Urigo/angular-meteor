var angularMeteorUser = angular.module('angular-meteor.user', []);

angularMeteorUser.run(['$rootScope', function($rootScope){
  Deps.autorun(function(self) {
    $rootScope.currentUser = Meteor.user();
    $rootScope.loggingIn = Meteor.loggingIn();
    if (!$rootScope.$$phase) $rootScope.$apply();
    $rootScope.$on('$destroy', function () {
      self.stop(); // Stop computation if scope is destroyed.
    });
  });
}]);