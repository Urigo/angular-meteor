var ngMeteorTemplate = angular.module('ngMeteor.template', []);

ngMeteorTemplate.run(['$templateCache', 
	function($templateCache) {
		for(key in Template){
			render = Template[key];
			$templateCache.put( key, render() );
		}
	}
]);