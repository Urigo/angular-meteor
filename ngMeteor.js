// Define ngMeteor and its dependencies
ngMeteor = angular.module('ngMeteor', [
	'ngMeteor.collections', 
	'ngMeteor.template',
	'hashKeyCopier',
	'ngRoute', 
	'ngTouch',
	'ngAnimate',
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'ngMock'
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
	if(Template.__defaultLayout__){
		// For compatability with iron-router
		Template.__defaultLayout__.rendered = function(){
			angular.bootstrap(document, ['ngMeteor']);
		}
	}else{
		angular.bootstrap(document, ['ngMeteor']);
	}
});