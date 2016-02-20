angular.module('angular-meteor.ironrouter', [])


.run([
  '$compile',
  '$document',
  '$rootScope',

function ($compile, $document, $rootScope) {
  const Router = (Package['iron:router'] || {}).Router;
  if (!Router) return;

  let isLoaded = false;

  // Recompile after iron:router builds page
  Router.onAfterAction((req, res, next) => {
    Tracker.afterFlush(() => {
      if (isLoaded) return;
      $compile($document)($rootScope);
      if (!$rootScope.$$phase) $rootScope.$apply();
      isLoaded = true;
    });
  });
}]);
