// Define angular-meteor and its dependencies
var angularMeteor = angular.module('angular-meteor', [
  'angular-meteor.subscribe',
  'angular-meteor.collection',
  'angular-meteor.object',
  'angular-meteor.user',
  'angular-meteor.methods',
  'angular-meteor.session',
  'angular-meteor.utils',
  'angular-meteor.camera',
  'angular-meteor.reactive-utils',
  'angular-meteor.reactive-scope',
  'angular-meteor.reactive-context'
]);

angularMeteor.run(['$compile', '$document', '$rootScope', function ($compile, $document, $rootScope) {
    // Recompile after iron:router builds page
    if(Package['iron:router']) {
      var appLoaded = false;
      Package['iron:router'].Router.onAfterAction(function(req, res, next) {
        Tracker.afterFlush(function() {
          if (!appLoaded) {
            $compile($document)($rootScope);
            if (!$rootScope.$$phase) $rootScope.$apply();
            appLoaded = true;
          }
        })
      });
    }
  }]);

// Putting all services under $meteor service for syntactic sugar
angularMeteor.service('$meteor', ['$meteorCollection', '$meteorCollectionFS', '$meteorObject', '$meteorMethods', '$meteorSession', '$meteorSubscribe', '$meteorUtils', '$meteorCamera', '$meteorUser',
  function($meteorCollection, $meteorCollectionFS, $meteorObject, $meteorMethods, $meteorSession, $meteorSubscribe, $meteorUtils, $meteorCamera, $meteorUser){
    this.collection = $meteorCollection;
    this.collectionFS = $meteorCollectionFS;
    this.object = $meteorObject;
    this.subscribe = $meteorSubscribe.subscribe;
    this.call = $meteorMethods.call;
    this.loginWithPassword = $meteorUser.loginWithPassword;
    this.requireUser = $meteorUser.requireUser;
    this.requireValidUser = $meteorUser.requireValidUser;
    this.waitForUser = $meteorUser.waitForUser;
    this.createUser = $meteorUser.createUser;
    this.changePassword = $meteorUser.changePassword;
    this.forgotPassword = $meteorUser.forgotPassword;
    this.resetPassword = $meteorUser.resetPassword;
    this.verifyEmail = $meteorUser.verifyEmail;
    this.loginWithMeteorDeveloperAccount = $meteorUser.loginWithMeteorDeveloperAccount;
    this.loginWithFacebook = $meteorUser.loginWithFacebook;
    this.loginWithGithub = $meteorUser.loginWithGithub;
    this.loginWithGoogle = $meteorUser.loginWithGoogle;
    this.loginWithMeetup = $meteorUser.loginWithMeetup;
    this.loginWithTwitter = $meteorUser.loginWithTwitter;
    this.loginWithWeibo = $meteorUser.loginWithWeibo;
    this.logout = $meteorUser.logout;
    this.logoutOtherClients = $meteorUser.logoutOtherClients;
    this.session = $meteorSession;
    this.autorun = $meteorUtils.autorun;
    this.getCollectionByName = $meteorUtils.getCollectionByName;
    this.getPicture = $meteorCamera.getPicture;
}]);
