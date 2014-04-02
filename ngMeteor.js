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

// Method to allow injection of angular modules dependencies into ngMeteor
ngMeteor.injector = function(modules) {
	angular.forEach(modules, function(module){
		ngMeteor.requires.push(module); 
	});
}

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