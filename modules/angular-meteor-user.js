var angularMeteorUser = angular.module('angular-meteor.user', ['angular-meteor.utils']);

angularMeteorUser.run(['$rootScope', '$meteorUtils', function($rootScope, $meteorUtils){
  $meteorUtils.autorun($rootScope, function(){
    if (Meteor.user) {
      $rootScope.currentUser = Meteor.user();
      $rootScope.loggingIn = Meteor.loggingIn();
    }
  });
}]);