var angularMeteorUser = angular.module('angular-meteor.user', ['angular-meteor.utils']);

angularMeteorUser.run(['$rootScope', '$meteorUtils', '$q', function($rootScope, $meteorUtils, $q){
  var currentUserDefer;

  $meteorUtils.autorun($rootScope, function(){
    if (Meteor.user) {
      $rootScope.currentUser = Meteor.user();
      $rootScope.loggingIn = Meteor.loggingIn();

      // if there is no currentUserDefer (on first autorun)
      // or it is already resolved, but the Meteor.user() is changing
      if (!currentUserDefer || Meteor.loggingIn() ) {
        currentUserDefer = $q.defer();
        $rootScope.currentUserPromise = currentUserDefer.promise;
      }
      if ( !Meteor.loggingIn() )
        currentUserDefer.resolve( Meteor.user() );
    }
  });
}]);

angularMeteorUser.service('$meteorUser', ['$q',
  function ($q) {
    this.loginWithPassword = function(user, password){

      var deferred = $q.defer();

      Meteor.loginWithPassword(user, password, function(err){
        if (err)
          deferred.reject(err);
        else
          deferred.resolve();
      });

      return deferred.promise;
    };

    this.createUser = function(options){

      var deferred = $q.defer();

      Meteor.createUser(options, function(err){
        if (err)
          deferred.reject(err);
        else
          deferred.resolve();
      });

      return deferred.promise;
    };

    this.changePassword = function(oldPassword, newPassword){

      var deferred = $q.defer();

      Meteor.changePassword(oldPassword, newPassword, function(err){
        if (err)
          deferred.reject(err);
        else
          deferred.resolve();
      });

      return deferred.promise;
    };

    this.forgotPassword = function(options){

      var deferred = $q.defer();

      Meteor.forgotPassword(options, function(err){
        if (err)
          deferred.reject(err);
        else
          deferred.resolve();
      });

      return deferred.promise;
    };

    this.resetPassword = function(token, newPassword){

      var deferred = $q.defer();

      Meteor.resetPassword(token, newPassword, function(err){
        if (err)
          deferred.reject(err);
        else
          deferred.resolve();
      });

      return deferred.promise;
    };

    this.verifyEmail = function(token){

      var deferred = $q.defer();

      Meteor.verifyEmail(token, function(err){
        if (err)
          deferred.reject(err);
        else
          deferred.resolve();
      });

      return deferred.promise;
    };

    this.logout = function(){

      var deferred = $q.defer();

      Meteor.logout(function(err){
          if (err)
            deferred.reject(err);
          else
            deferred.resolve();
        });

      return deferred.promise;
    };

    this.logoutOtherClients = function(){

      var deferred = $q.defer();

      Meteor.logoutOtherClients(function(err){
        if (err)
          deferred.reject(err);
        else
          deferred.resolve();
      });

      return deferred.promise;
    };

    this.loginWithFacebook = function(options){

      var deferred = $q.defer();

      Meteor.loginWithFacebook(options, function(err){
        if (err)
          deferred.reject(err);
        else
          deferred.resolve();
      });

      return deferred.promise;
    };

    this.loginWithTwitter = function(options){

      var deferred = $q.defer();

      Meteor.loginWithTwitter(options, function(err){
        if (err)
          deferred.reject(err);
        else
          deferred.resolve();
      });

      return deferred.promise;
    };

    this.loginWithGoogle = function(options){

      var deferred = $q.defer();

      Meteor.loginWithGoogle(options, function(err){
        if (err)
          deferred.reject(err);
        else
          deferred.resolve();
      });

      return deferred.promise;
    };

    this.loginWithGithub = function(options){

      var deferred = $q.defer();

      Meteor.loginWithGithub(options, function(err){
        if (err)
          deferred.reject(err);
        else
          deferred.resolve();
      });

      return deferred.promise;
    };

    this.loginWithMeteorDeveloperAccount = function(options){

      var deferred = $q.defer();

      Meteor.loginWithMeteorDeveloperAccount(options, function(err){
        if (err)
          deferred.reject(err);
        else
          deferred.resolve();
      });

      return deferred.promise;
    };

    this.loginWithMeetup = function(options){

      var deferred = $q.defer();

      Meteor.loginWithMeetup(options, function(err){
        if (err)
          deferred.reject(err);
        else
          deferred.resolve();
      });

      return deferred.promise;
    };

    this.loginWithWeibo = function(options){

      var deferred = $q.defer();

      Meteor.loginWithWeibo(options, function(err){
        if (err)
          deferred.reject(err);
        else
          deferred.resolve();
      });

      return deferred.promise;
    };
  }]);
