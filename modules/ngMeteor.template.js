var ngMeteorTemplate = angular.module('ngMeteor.template', []);

ngMeteorTemplate.run(['$templateCache', 
	function($templateCache) {
		for(name in Template){
			render = Template[name];
			$templateCache.put( name, render() );
		}
	}
]);