var ngMeteorTemplate = angular.module('ngMeteor.template', []);

ngMeteorTemplate.run(['$templateCache', 
	function($templateCache) {
		for(name in Template){
			render = Template[name];
			$templateCache.put( angular.lowercase(name), render() );
		}
	}
]);

ngMeteorTemplate.directive('ngmeteor', function($templateCache){
	return{
		restrict: 'E',
		scope: true,
		template: $templateCache.get('ngmeteor')
	}
});
