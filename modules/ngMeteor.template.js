var ngMeteorTemplate = angular.module('ngMeteor.template', []);

ngMeteorTemplate.run(['$templateCache', 
	function($templateCache) {
		angular.forEach(Template, function(render, name){
			if(name !== "__define__"){
				$templateCache.put(name, render);
			}
		});
	}
]);

ngMeteorTemplate.directive('ngTemplate', ['$http', '$templateCache', '$compile',
	function($http, $templateCache, $compile) {
		return {
			restrict: 'A',
			scope: true,
			link: function(scope, element, attributes) {
	            $http.get(attributes.ngTemplate, {cache: $templateCache})
					.success(function(template){
						element.html(template);
						element.replaceWith($compile(element.html())(scope));
					});
	        }
		};
	}
]);