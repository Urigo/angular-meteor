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