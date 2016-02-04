'use strict';

var angularMeteorUser = angular.module('angular-meteor.user', [
  'angular-meteor.utils',
  'angular-meteor.reactive-scope'
]);

// requires package 'accounts-password'
angularMeteorUser.service('$meteorUser', [
  '$rootScope', '$meteorUtils', '$q',
  function($rootScope, $meteorUtils, $q){

    var pack = Package['accounts-base'];
    if (!pack) return;

    var self = this;
    var Accounts = pack.Accounts;

    this.waitForUser = function(){
      console.warn('[angular-meteor.waitForUser] Please note that this method is deprecated since 1.3.0 and will be removed in 1.4.0! http://info.meteor.com/blog/angular-meteor-1.3');

      var deferred = $q.defer();

      $meteorUtils.autorun($rootScope, function(){
        if ( !Meteor.loggingIn() )
          deferred.resolve( Meteor.user() );
      }, true);

      return deferred.promise;
    };

    this.requireUser = function(ignoreDeprecation){
      if (!ignoreDeprecation) {
        console.warn('[angular-meteor.requireUser] Please note that this method is deprecated since 1.3.0 and will be removed in 1.4.0! http://info.meteor.com/blog/angular-meteor-1.3');
      }

      var deferred = $q.defer();

      $meteorUtils.autorun($rootScope, function(){
        if ( !Meteor.loggingIn() ) {
          if ( Meteor.user() == null)
            deferred.reject("AUTH_REQUIRED");
          else
            deferred.resolve( Meteor.user() );
        }
      }, true);

      return deferred.promise;
    };

    this.requireValidUser = function(validatorFn) {
      console.warn('[angular-meteor.requireValidUser] Please note that this method is deprecated since 1.3.0 and will be removed in 1.4.0! http://info.meteor.com/blog/angular-meteor-1.3');

      return self.requireUser(true).then(function(user){
        var valid = validatorFn( user );

        if ( valid === true )
          return user;
        else if ( typeof valid === "string" )
          return $q.reject( valid );
        else
          return $q.reject( "FORBIDDEN" );
	    });
	  };

    this.loginWithPassword = $meteorUtils.promissor(Meteor, 'loginWithPassword');
    this.createUser = $meteorUtils.promissor(Accounts, 'createUser');
    this.changePassword = $meteorUtils.promissor(Accounts, 'changePassword');
    this.forgotPassword = $meteorUtils.promissor(Accounts, 'forgotPassword');
    this.resetPassword = $meteorUtils.promissor(Accounts, 'resetPassword');
    this.verifyEmail = $meteorUtils.promissor(Accounts, 'verifyEmail');
    this.logout = $meteorUtils.promissor(Meteor, 'logout');
    this.logoutOtherClients = $meteorUtils.promissor(Meteor, 'logoutOtherClients');
    this.loginWithFacebook = $meteorUtils.promissor(Meteor, 'loginWithFacebook');
    this.loginWithTwitter = $meteorUtils.promissor(Meteor, 'loginWithTwitter');
    this.loginWithGoogle = $meteorUtils.promissor(Meteor, 'loginWithGoogle');
    this.loginWithGithub = $meteorUtils.promissor(Meteor, 'loginWithGithub');
    this.loginWithMeteorDeveloperAccount = $meteorUtils.promissor(Meteor, 'loginWithMeteorDeveloperAccount');
    this.loginWithMeetup = $meteorUtils.promissor(Meteor, 'loginWithMeetup');
    this.loginWithWeibo = $meteorUtils.promissor(Meteor, 'loginWithWeibo');
  }
]);

angularMeteorUser.run([
  '$rootScope',
  function($rootScope){
    console.warn('[angular-meteor.$rootScope.currentUser/loggingIn] Please note that this functionality has migrated to a separate package and will be deprecated in 1.4.0.  For more info: http://www.angular-meteor.com/api/1.3.2/auth');
    $rootScope.autorun(function(){
      if (!Meteor.user) return;
      $rootScope.currentUser = Meteor.user();
      $rootScope.loggingIn = Meteor.loggingIn();
    });
  }
]);
