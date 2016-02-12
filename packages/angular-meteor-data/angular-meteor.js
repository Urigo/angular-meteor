angular.module('angular-meteor', [
  // new
  'angular-meteor.utilities',
  'angular-meteor.mixer',
  'angular-meteor.scope',
  'angular-meteor.core',
  'angular-meteor.view-model',
  'angular-meteor.reactive',

  // legacy
  'angular-meteor.ironrouter',
  'angular-meteor.utils',
  'angular-meteor.subscribe',
  'angular-meteor.collection',
  'angular-meteor.object',
  'angular-meteor.user',
  'angular-meteor.methods',
  'angular-meteor.session',
  'angular-meteor.camera'

])

.constant('$angularMeteorSettings', {
  suppressWarnings: false
})

.run([
  '$Mixer',
  '$$Core',
  '$$ViewModel',
  '$$Reactive',

function($Mixer, $$Core, $$ViewModel, $$Reactive) {
  // Load all mixins
  $Mixer
    .mixin($$Core)
    .mixin($$ViewModel)
    .mixin($$Reactive);
}])

// legacy
// Putting all services under $meteor service for syntactic sugar
.service('$meteor', ['$meteorCollection', '$meteorCollectionFS', '$meteorObject', '$meteorMethods', '$meteorSession', '$meteorSubscribe', '$meteorUtils', '$meteorCamera', '$meteorUser',
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
