// ngMeteor - Package Scope Variable
ngMeteor = angular.module('ngMeteor', ['ngMeteor.touch','ngMeteor.template']);

// Change the data-bindings from {{foo}} to [[foo]]
ngMeteor.config(['$interpolateProvider', function ($interpolateProvider) {
	$interpolateProvider.startSymbol('[[');
	$interpolateProvider.endSymbol(']]');
}]);

// Manual initilisation of the ngMeteor module
angular.element(document).ready(function() {
	angular.bootstrap(document, ['ngMeteor']);
});


