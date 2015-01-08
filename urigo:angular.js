// Define angular-meteor and its dependencies
angularMeteor = angular.module('angular-meteor', [
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

// Method to allow injection of angular modules dependencies into angular-meteor
angularMeteor.injector = function (modules) {
  angular.forEach(modules, function (module) {
    angularMeteor.requires.push(module);
  });
};

var onReady = function () {
  if (!angular.element(document).injector()) {
    angular.bootstrap(document, ['angular-meteor']);
  }

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
