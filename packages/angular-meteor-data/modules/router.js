angular.module('angular-meteor.router', [])


.run([
  '$compile',
  '$document',
  '$rootScope',

function ($compile, $document, $rootScope) {
  const Router = (Package['iron:router'] || {}).Router;
  if (!Router) return;

  let isLoaded = false;

  Router.onAfterAction((req, res, next) => {
    Tracker.afterFlush(() => {
      if (isLoaded) return;
      $compile($document)($rootScope);
      if (!$rootScope.$$phase) $rootScope.$apply();
      isLoaded = true;
    });
  });
}]);
