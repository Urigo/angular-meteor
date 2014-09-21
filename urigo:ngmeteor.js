// Define ngMeteor and its dependencies
ngMeteor = angular.module('ngMeteor', [
  'ngMeteor.collections',
  'ngMeteor.template',
  'hashKeyCopier'
]);

// Method to allow injection of angular modules dependencies into ngMeteor
ngMeteor.injector = function (modules) {
  angular.forEach(modules, function (module) {
    ngMeteor.requires.push(module);
  });
};

// Change the data-bindings from {{foo}} to [[foo]]
ngMeteor.config(['$interpolateProvider',
  function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
  }
]);

// Manual initilisation of ngMeteor
angular.element(document).ready(function () {
  if (!angular.element(document).injector()) {
    angular.bootstrap(document, ['ngMeteor']);
  }

  // Recompiles whenever the DOM elements are updated.
  var notifyParented = Blaze.View.notifyParented;
  Blaze.View.notifyParented = function () {
    notifyParented.apply(this, arguments);
    if (this.region) {
      Deps.afterFlush(function() {
        angular.element(document).injector().invoke(['$compile', '$document', '$rootScope',
          function ($compile, $document, $rootScope) {
            $compile($document)($rootScope);
            if (!$rootScope.$$phase) $rootScope.$apply();
          }
        ]);
      });
    }
  }
});