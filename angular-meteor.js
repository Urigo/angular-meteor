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
  'hashKeyCopier'
]);

angularMeteor.run(['$compile', '$document', '$rootScope', function ($compile, $document, $rootScope) {
    // Recompile after iron:router builds page
    if(typeof Router != 'undefined') {
      Router.onAfterAction(function(req, res, next) {
        Tracker.afterFlush(function() {
          $compile($document)($rootScope);
          if (!$rootScope.$$phase) $rootScope.$apply();
        });
      });
    }
  }]);

// Putting all services under $meteor service for syntactic sugar
angularMeteor.service('$meteor', ['$meteorCollection', '$meteorObject', '$meteorMethods', '$meteorSession', '$meteorSubscribe', '$meteorUtils',
  function($meteorCollection, $meteorObject, $meteorMethods, $meteorSession, $meteorSubscribe, $meteorUtils){
    this.collection = $meteorCollection;
    this.object = $meteorObject;
    this.subscribe = $meteorSubscribe.subscribe;
    this.call = $meteorMethods.call;
    this.session = $meteorSession;
    this.autorun = $meteorUtils.autorun;
    this.getCollectionByName = $meteorUtils.getCollectionByName;
}]);
