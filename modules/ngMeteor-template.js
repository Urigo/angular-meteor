var ngMeteorTemplate = angular.module('ngMeteor.template', []);

ngMeteorTemplate.run(['$templateCache',
	function($templateCache) {
		angular.forEach(Template, function(render, name){
			if(name !== "__define__"){
				$templateCache.put(name, render() );
			}
		});
	}
]);

ngMeteorTemplate.directive('ngTemplate', ['$templateCache', '$compile',
	function($templateCache, $compile) {
		return {
			restrict: 'AE',
			scope: true,
			link: function(scope, element, attributes) {
				var	name = attributes.ngTemplate || attributes.name,
					template = $templateCache.get(name);
				if(angular.isDefined(template)){
					element.html(template);
					element.replaceWith($compile(element.html())(scope));
				} else{
					console.error("ngMeteor: There is no template with the name '" + attributes.ngTemplate + "'");
				}
	        }
		};
	}
]);

// Re-compiles template when rendering with Iron-Router
angular.element(document).ready(function() {
	if(Package['iron-router']){
		var oldRun = Router.run;
		Router.run = function() {
			var runResult = oldRun.apply(this, arguments);
			key = this._currentController.template
			Template[key].rendered = function(){
				angular.element(document).injector().invoke(function($compile, $document, $rootScope){
					$compile($document)($rootScope);
					$rootScope.$digest();
				});
				Template[key].rendered = null;
			}
			return runResult;
		};
	}
});
