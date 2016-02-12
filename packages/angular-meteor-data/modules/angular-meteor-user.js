/*global
 angular, _, Package, Meteor
 */

'use strict';

var angularMeteorUser = angular.module('angular-meteor.user', [
  'angular-meteor.utils',
  'angular-meteor.core'
]);

// requires package 'accounts-password'
angularMeteorUser.service('$meteorUser', [
  '$rootScope', '$meteorUtils', '$q', '$angularMeteorSettings',
  function($rootScope, $meteorUtils, $q, $angularMeteorSettings){

    var pack = Package['accounts-base'];
    if (!pack) return;

    var self = this;
    var Accounts = pack.Accounts;

    this.waitForUser = function(){
      if (!$angularMeteorSettings.suppressWarnings)
        console.warn('[angular-meteor.waitForUser] Please note that this method is deprecated since 1.3.0 and will be removed in 1.4.0! http://info.meteor.com/blog/angular-meteor-1.3. You can disable this warning by following this guide http://www.angular-meteor.com/api/1.3.6/settings');

      var deferred = $q.defer();

      $meteorUtils.autorun($rootScope, function(){
        if ( !Meteor.loggingIn() )
          deferred.resolve( Meteor.user() );
      }, true);

      return deferred.promise;
    };

    this.requireUser = function(){
      if (!$angularMeteorSettings.suppressWarnings) {
        console.warn('[angular-meteor.requireUser] Please note that this method is deprecated since 1.3.0 and will be removed in 1.4.0! http://info.meteor.com/blog/angular-meteor-1.3. You can disable this warning by following this guide http://www.angular-meteor.com/api/1.3.6/settings');
      }

      var deferred = $q.defer();

      $meteorUtils.autorun($rootScope, function(){
        if ( !Meteor.loggingIn() ) {
          if ( Meteor.user() === null)
            deferred.reject("AUTH_REQUIRED");
          else
            deferred.resolve( Meteor.user() );
        }
      }, true);

      return deferred.promise;
    };

    this.requireValidUser = function(validatorFn) {
      if (!$angularMeteorSettings.suppressWarnings)
        console.warn('[angular-meteor.requireValidUser] Please note that this method is deprecated since 1.3.0 and will be removed in 1.4.0! http://info.meteor.com/blog/angular-meteor-1.3. You can disable this warning by following this guide http://www.angular-meteor.com/api/1.3.6/settings');

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
  '$rootScope', '$angularMeteorSettings', '$$Core',
  function($rootScope, $angularMeteorSettings, $$Core){

    let ScopeProto = Object.getPrototypeOf($rootScope);
    _.extend(ScopeProto, $$Core);

    $rootScope.autorun(function(){
      if (!Meteor.user) return;
      $rootScope.currentUser = Meteor.user();
      $rootScope.loggingIn = Meteor.loggingIn();
    });
  }
]);
