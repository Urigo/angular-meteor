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
        // Since Router.current().ready() is reactive we wrap it in Tracker.nonreactive to avoid re-runs.
        Tracker.nonreactive(function() {
          if (Router.current().ready()) {
            // Again since Router.current().ready() is reactive we cant wrap it in Tracker.afterFlush
            // therefor we use it twice for ready and not ready cases (see below).
            Tracker.afterFlush(function() {
                // Checks if document's been compiled to the moment.
                // If yes, compile only newly inserted parts.
                if (Router.current()._docCompiled) {
                    for (var prop in Router.current()._layout._regions) {
                    var region = Router.current()._layout._regions[prop];
                    var firstNode = region.view._domrange.firstNode();
                    var lastNode = region.view._domrange.lastNode();
                    $compile(firstNode)($rootScope);
                    if (firstNode != lastNode) {
                      $compile(lastNode)($rootScope);
                    }
                  }
             } else {
                	  $compile($document)($rootScope);
                  	Router.current()._docCompiled = true;
                }
                if (!$rootScope.$$phase) $rootScope.$apply();  
            });
          } else {
            // Compiles and applies scope for the first time when current route is not ready.
            Tracker.afterFlush(function() {
              $compile($document)($rootScope);
              if (!$rootScope.$$phase) $rootScope.$apply();
              Router.current()._docCompiled = true;
            });
          }
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
