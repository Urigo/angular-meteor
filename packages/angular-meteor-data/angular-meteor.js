angular.module('angular-meteor', [
  'angular-meteor.utils',
  'angular-meteor.mixer',
  'angular-meteor.scope',
  'angular-meteor.core',
  'angular-meteor.view-model',
  'angular-meteor.reactive'
])


.run([
  '$compile',
  '$document',
  '$rootScope',

function ($compile, $document, $rootScope) {
  let RouterPack = Package['iron:router'];
  if (!RouterPack) return;

  let Router = RouterPack.Router;
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
