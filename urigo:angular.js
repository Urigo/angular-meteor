// Define angular-meteor and its dependencies
angular.module('angular-meteor', [
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

var onReady = function () {

// Recompile after iron:router builds page
  if(typeof Router != 'undefined') {
    Router.onAfterAction(function(req, res, next) {
      Tracker.afterFlush(function() {
        angular.element(document).injector().invoke(['$compile', '$document', '$rootScope',
          function ($compile, $document, $rootScope) {
            $compile($document)($rootScope);
            if (!$rootScope.$$phase) $rootScope.$apply();
          }
        ]);
      });
    });
  }
};

// Manual initialisation of angular-meteor
if (Meteor.isCordova) {
  angular.element(document).on("deviceready", onReady);
}
else {
  angular.element(document).ready(onReady);
}
