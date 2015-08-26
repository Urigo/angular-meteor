'use strict';

var angularMeteorUser = angular.module('angular-meteor.user', ['angular-meteor.utils']);

// requires package 'accounts-password'
angularMeteorUser.service('$meteorUser', [
  '$rootScope', '$meteorUtils', '$q',
  function($rootScope, $meteorUtils, $q){
    var pack = Package['accounts-base'];
    if (!pack) return;

    var self = this;
    var Accounts = pack.Accounts;

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
  '$rootScope', '$meteorUtils',
  function($rootScope, $meteorUtils){
    $meteorUtils.autorun($rootScope, function(){
      if (!Meteor.user) return;
      $rootScope.currentUser = Meteor.user();
      $rootScope.loggingIn = Meteor.loggingIn();
    });
  }
]);