var ngMeteorCollections = angular.module('ngMeteor.collections', []);

ngMeteorCollections.config(['$provide', '$windowProvider',
	function ($provide, $windowProvider) {
		var self = $windowProvider.$get();
		angular.forEach(self, function(collection,name){
			if(collection instanceof Meteor.Collection){
				$provide.factory('$' + name, function($rootScope) {
					Deps.autorun(function(){
						Meteor.subscribe(name);
						$rootScope[name] = collection.find().fetch();
						if(!$rootScope.$$phase) {
							$rootScope.$apply();
						}
						angular.extend($rootScope[name].__proto__, {
							save: function(data){
								if(!data){
									console.log("All");
								} else{
									collection.insert(data);
								}
								Deps.flush();
							}
						});
						console.log($rootScope[name]);
					});
				});
			}
		});
	}
]);