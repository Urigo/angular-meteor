// Define angular-meteor and its dependencies
var angularMeteor = angular.module('angular-meteor', [
  'angular-meteor.subscribe',
  'angular-meteor.collections',
  'angular-meteor.meteor-collection',
  'angular-meteor.object',
  'angular-meteor.template',
  'angular-meteor.user',
  'angular-meteor.methods',
  'angular-meteor.session',
  'angular-meteor.reactive-scope',
  'angular-meteor.utils',
  'angular-meteor.camera',
  'hashKeyCopier'
]);

angularMeteor.run(['$compile', '$document', '$rootScope', function ($compile, $document, $rootScope) {
    // Recompile after iron:router builds page
    if(typeof Router != 'undefined') {
      Router.onAfterAction(function(req, res, next) {
        // Since Router.current().ready() is reactive we wrap it in Tracker.nonreactive
        // to avoid re-runs.
        Tracker.nonreactive(function() {
          Tracker.afterFlush(function() {
            var route = Router.current();
            if (route.ready()) {
              // Since onAfterAction runs always twice when a route has waitOn's subscriptions,
              // we need to handle case when data is already loaded at the moment
              // Tracker.afterFlush executes which means it will run twice with
              // Router.current().ready equals true.
              // That's we save state to an additional auxiliry variable _done.
              if (!route.state.get('__rendered')) {
                // Checks if document's been compiled to the moment.
                // If yes, compile only newly inserted parts.
                if (route.state.get('__compiled')) {
                  for (var prop in route._layout._regions) {
                    var region = route._layout._regions[prop];
                    var node = region.view._domrange.firstNode();
                    while (node) {
                       $compile(node)($rootScope);
                       node = node.nextSibling;
                    }
                  }
                } else {
                  $compile($document)($rootScope);
                }
                if (!$rootScope.$$phase) $rootScope.$apply();
                route.state.set('__rendered', true);
              }
            } else {
                // Compiles and applies scope for the first time when current route is not ready.
                $compile($document)($rootScope);
                if (!$rootScope.$$phase) $rootScope.$apply();
                route.state.set('__compiled', true);
             }
          });
        });
      });
    }
  }]);

// Putting all services under $meteor service for syntactic sugar
angularMeteor.service('$meteor', ['$meteorCollection', '$meteorObject', '$meteorMethods', '$meteorSession', '$meteorSubscribe', '$meteorUtils', '$meteorCamera', '$meteorUser',
  function($meteorCollection, $meteorObject, $meteorMethods, $meteorSession, $meteorSubscribe, $meteorUtils, $meteorCamera, $meteorUser){
    this.collection = $meteorCollection;
    this.object = $meteorObject;
    this.subscribe = $meteorSubscribe.subscribe;
    this.call = $meteorMethods.call;
    this.loginWithPassword = $meteorUser.loginWithPassword;
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
