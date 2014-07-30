var ngMeteorTemplate = angular.module('ngMeteor.template', []);

ngMeteorTemplate.run(['$templateCache',
	function($templateCache) {
		angular.forEach(Template, function(template, name){
			if(name.charAt(0) != "_" && name != "prototype"){
				var templateString;
				// test for pre 0.8.3
				if(template.render)
					templateString = HTML.toHTML(template.render());
				else
					templateString = Blaze.toHTML(template);
				$templateCache.put(name, templateString);
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
            var oldRendered = Template[key].rendered;
            Template[key].rendered = function(){
                angular.element(document).injector().invoke(['$compile', '$document', '$rootScope', function($compile, $document, $rootScope){
                    $compile($document)($rootScope);
                    $rootScope.$digest();
                    oldRendered.apply(this, arguments);
                }]);
                Template[key].rendered = oldRendered;
            }
            return runResult;
        };
    }
});
