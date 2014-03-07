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
	'ngSanitize'
	//'ngMock'
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


/*
// Manual initilisation of ngMeteor
angular.element(document).ready(function() {
	if (!angular.element(document).injector()){
		angular.bootstrap(document, ['ngMeteor']);
	}
	angular.forEach(Template, function(template,name){
		if(name != 'layout' && name != '__defaultLayout__'){
			template.rendered = function(){
				//var html = $(this.data.yield().string);

				html = $('body');
				console.log( name );
				console.log( angular.element(html).scope() );

				if (!angular.element(document).injector()){
					angular.bootstrap(document, ['ngMeteor']);
				}else{
					angular.element(document).injector().invoke(function($rootScope, $compile, $document){
						$compile($document)($rootScope);
						$rootScope.$digest();
					});
				}
			}
		}
	});
});
*/