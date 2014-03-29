var ngMeteorTemplate = angular.module('ngMeteor.template', []);

ngMeteorTemplate.run(['$templateCache',
	function($templateCache) {
		angular.forEach(Template, function(template, name){
			if(name.charAt(0) != "_"){
				$templateCache.put(name, '<div ng-template="' + name + '"></div>');
			}
		});
	}
]);

ngMeteorTemplate.directive('ngTemplate', [
	function() {
		return {
			restrict: 'A',
			scope: true,
			template: function(element, attributes){
				var	name = attributes.ngTemplate,   
					template = Template[name],
					templateString = null;

				if(angular.isDefined(template)){
					templateString = HTML.toHTML(template.render());
				} else{
					throw new ReferenceError("There is no Meteor template with the name '" + name + "'.");
				}

		      	return templateString;		    
			},
			link: function(scope, element, attributes) {
				var	name = attributes.ngTemplate,
					template = Template[name];
					
				angular.forEach(template._events, function(eventObj){
					var eventType = eventObj.events,
						eventSelector = eventObj.selector,
						eventHandler = eventObj.handler;
					$('[ng-template="' + name + '"] ' + eventSelector + '').bind(eventType, eventHandler);
				});
			}
		};
	}
]);

// Re-compiles template when rendering with Iron-Router
angular.element(document).ready(function() {
    if(Package['iron-router']){
        var oldRun = Router.run;
        Router.run = function() {
            var runResult = oldRun.apply(this, arguments),
            	key = this._currentController.template,
            	oldRendered = Template[key].rendered;
            Template[key].rendered = function(){
                angular.element(document).injector().invoke(['$compile', '$document', '$rootScope', 
                	function($compile, $document, $rootScope){
	                    $compile($document)($rootScope);
	                    $rootScope.$digest();
	                    oldRendered.apply(this, arguments);
                	}
                ]);
                Template[key].rendered = oldRendered;
            }
            return runResult;
        };
    }
});
