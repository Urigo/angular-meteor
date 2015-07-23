var angularMeteorUser = angular.module('angular-meteor.user', ['angular-meteor.utils']);

angularMeteorUser.run(['$rootScope', '$meteorUtils', function($rootScope, $meteorUtils){

  $meteorUtils.autorun($rootScope, function(){
    if (Meteor.user) {
      $rootScope.currentUser = Meteor.user();
      $rootScope.loggingIn = Meteor.loggingIn();
    }
  });
}]);

angularMeteorUser.service('$meteorUser', ['$rootScope', '$meteorUtils', '$q',
  function($rootScope, $meteorUtils, $q){
    var self = this;

    this.waitForUser = function(){

      var deferred = $q.defer();

      $meteorUtils.autorun($rootScope, function(){
        if ( !Meteor.loggingIn() )
          deferred.resolve( Meteor.user() );
      });

      return deferred.promise;
    };

    this.requireUser = function(){

      var deferred = $q.defer();

      $meteorUtils.autorun($rootScope, function(){
        if ( !Meteor.loggingIn() ) {
          if ( Meteor.user() == null)
            deferred.reject("AUTH_REQUIRED");
          else
            deferred.resolve( Meteor.user() );
        }
      });

      return deferred.promise;
    };

    this.requireValidUser = function(validatorFn) {
      return self.requireUser().then(function(user){
        var valid = validatorFn( user );

        if ( valid === true )
          return user;
        else if ( typeof valid === "string" )
          return $q.reject( valid );
        else
          return $q.reject( "FORBIDDEN" );
	  });
	};

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

      Accounts.createUser(options, function(err){
        if (err)
          deferred.reject(err);
        else
          deferred.resolve();
      });

      return deferred.promise;
    };

    this.changePassword = function(oldPassword, newPassword){

      var deferred = $q.defer();

      Accounts.changePassword(oldPassword, newPassword, function(err){
        if (err)
          deferred.reject(err);
        else
          deferred.resolve();
      });

      return deferred.promise;
    };

    this.forgotPassword = function(options){

      var deferred = $q.defer();

      Accounts.forgotPassword(options, function(err){
        if (err)
          deferred.reject(err);
        else
          deferred.resolve();
      });

      return deferred.promise;
    };

    this.resetPassword = function(token, newPassword){

      var deferred = $q.defer();

      Accounts.resetPassword(token, newPassword, function(err){
        if (err)
          deferred.reject(err);
        else
          deferred.resolve();
      });

      return deferred.promise;
    };

    this.verifyEmail = function(token){

      var deferred = $q.defer();

      Accounts.verifyEmail(token, function(err){
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
