var ngMeteorTemplate = angular.module('ngMeteor.template', []);

ngMeteorTemplate.run(['$templateCache', '$rootScope', '$compile', 
	function($templateCache, $rootScope, $compile) {
		for(key in Template){
			render = Template[key];
			$templateCache.put(key + ".html", render() );
		}
	}
]);