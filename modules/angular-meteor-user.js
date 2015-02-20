var angularMeteorUser = angular.module('angular-meteor.user', ['angular-meteor.utils']);

angularMeteorUser.run(['$rootScope', '$meteorUtils', function($rootScope, $meteorUtils){
  var currentUserDefer;

  $meteorUtils.autorun($rootScope, function(){
    if (Meteor.user) {
      $rootScope.currentUser = Meteor.user();
      $rootScope.loggingIn = Meteor.loggingIn();
    }

    // if there is no currentUserDefer (on first autorun)
    // or it is already resolved, but the Meteor.user() is changing
    if (!currentUserDefer || Meteor.loggingIn() ) {
      currentUserDefer = $q.defer();
      $rootScope.currentUserPromise = currentUserDefer.promise;
    }
    if ( !Meteor.loggingIn() ) {
      currentUserDefer.resolve( Meteor.user() );
    }

  });
}]);