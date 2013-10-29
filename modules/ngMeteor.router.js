var ngMeteorRouter = angular.module('ngMeteor.router', ['ngRoute']);

ngMeteorRouter.config(['$provide', '$routeProvider', '$locationProvider',
	function($provide, $routeProvider, $locationProvider) {
		// Make the $routeProvider available at run.
	    $provide.factory('$routeProvider', function () {
	        return $routeProvider;
	    });
	    // Enables html5 push state
	    $locationProvider.html5Mode(true);
	}
]).run(['$routeProvider', '$filter', '$templateCache',
	function($routeProvider, $filter, $templateCache){
		// Gets a list of all controllers registered under $controllerProvider in the ngMeteor module.
		var controllers = [];
		angular.forEach(ngMeteor._invokeQueue, function(value, key){
			if(value[0] === "$controllerProvider"){
				this.push(value[2][0]);
			}
		},controllers);

		// Creates the index route. Loads the index view and loads the index controller if it exists.
		var indexName = "index";
		if($filter('filter')(controllers, name, true).length === 1){
			$routeProvider.when('/', {templateUrl: indexName, controller: name});
		}else{
			$routeProvider.when('/', {templateUrl: indexName});
		}

		// Gets a list of all templates in Templates. Creates a route for all templates based on its name. 
		// Loads the template view and the template controller if it exists based on its name.
		angular.forEach(Template, function(render, name){
			if(name.substring(0,1) !== "_"){
				var path = "/" + name.replace(/\./g, "/").replace(/\_/g,"/:");
				if($filter('filter')(controllers, name , true).length === 1){
					$routeProvider.when(path, {templateUrl: name, controller: name });
				}else{
					$routeProvider.when(path, {templateUrl: name});
				}
			}
		});

		// Redirects to index if there were no matching routes.
		$routeProvider.otherwise({ redirectTo: '/' });
	}
]);