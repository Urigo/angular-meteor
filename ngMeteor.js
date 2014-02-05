// ngMeteor - Package Scope Variable
ngMeteor = angular.module('ngMeteor', [
	//ngMeteor core packages.
	'ngMeteor.collections', 
	'ngMeteor.template',
	'hashKeyCopier',
	//Optional packages. Will separate these out into separate smart packages later.
	//'ngMeteor.router',
	//'ngMeteor.touch', 
	//'ui.select2',
	//Angular optional packages. Testing modules such as mock and scenario have been omitted.
	'ngRoute', //This is already included in ngMeteor.router
	'ngTouch',
	'ngAnimate',
	'ngCookies',
	'ngResource',
	'ngSanitize',
]);

// Change the data-bindings from {{foo}} to [[foo]]
ngMeteor.config(['$interpolateProvider',
	function ($interpolateProvider) {
		$interpolateProvider.startSymbol('[[');
		$interpolateProvider.endSymbol(']]');
	}
]);

// Manual initilisation of the ngMeteor module
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