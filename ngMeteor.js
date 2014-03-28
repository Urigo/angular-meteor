// Define ngMeteor and its dependencies
ngMeteor = angular.module('ngMeteor', [
	'ngMeteor.collections', 
	'ngMeteor.template',
	'ngRoute', 
	'ngTouch',
	'ngAnimate',
	'ngCookies',
	'ngResource',
	'ngSanitize'
]);

// Change the data-bindings from {{foo}} to [[foo]]
ngMeteor.config(['$interpolateProvider',
	function ($interpolateProvider) {
		$interpolateProvider.startSymbol('[[');
		$interpolateProvider.endSymbol(']]');
	}
]);

// Manual initilisation of ngMeteor
angular.element(document).ready(function() {
	if (!angular.element(document).injector()){
		angular.bootstrap(document, ['ngMeteor']);
	}
});
