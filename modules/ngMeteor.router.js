var ngMeteorRouter = angular.module('ngMeteor.router', ['ngRoute']);

ngMeteorRouter.config(['$provide', '$routeProvider', '$locationProvider',
	function($provide, $routeProvider, $locationProvider, $controllerProvider) {
		// Make the $routeProvider available at run.
	    $provide.factory('$routeProvider', function () {
	        return $routeProvider;
	    });
	    // Enables html5 push state
	    $locationProvider.html5Mode(true);
	}
]).run(['$routeProvider', '$templateCache', '$filter',
	function($routeProvider, $templateCache, $filter){
		// Gets a list of all controllers registered under $controllerProvider in the ngMeteor module.
		var controllers = [];
		angular.forEach(ngMeteor._invokeQueue, function(value, key){
			if(value[0] === "$controllerProvider"){
				this.push(value[2][0]);
			}
		},controllers);

		// Creates the index route. Loads the index view and loads the index controller if it exists.
		var indexName = "index";
		if($filter('filter')(controllers, indexName, true).length < 1){
			$routeProvider.when('/', {templateUrl: indexName});
		}else{
			$routeProvider.when('/', {templateUrl: indexName, controller: indexName});
		}

		// Gets a list of all templates in Templates. Creates a route for all templates based on its name. 
		// Loads the template view and the template controller if it exists based on its name.
		for(name in Template){
			var path = "/" + name.replace(/\./g, "/").replace(/\_/g,"/:");
			if($filter('filter')(controllers, name, true).length < 1){
				$routeProvider.when(path, {templateUrl: name});
			}else{
				$routeProvider.when(path, {templateUrl: name, controller: name});
			}
		}

		// Redirects to index if there were no matching routes.
		$routeProvider.otherwise({ redirectTo: '/' });
	}
]);