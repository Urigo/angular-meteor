var ngMeteorCollections = angular.module('ngMeteor.collections', []);

ngMeteorCollections.factory('$collection', ['$window', '$rootScope',
	function($window, $rootScope){
		return function (name, scope, selector, options) {
			var collection = $window[name];
			if(!selector) selector = {};
			if(collection instanceof Meteor.Collection){
				Deps.autorun(function(){
					Meteor.subscribe(name);
					scope[name] = collection.find(selector, options).fetch();
					if(!scope.$$phase) {
						scope.$apply();
					}
				});
				angular.extend(scope[name].__proto__, {
					add: function(data){
						data = angular.copy(data);
						upsert = function(item){
							if(!item._id){
								collection.insert(item);
							}else{
								collection.update(item._id, item);
							}
						}
						if(!data){
							console.error("Cannot add null");
						} else{
							if(angular.isArray(data)){
								angular.forEach(data, function(value, key){
									upsert(value);
								});
							}else{
								upsert(data);
							}
						}
						Deps.flush();
					},
					delete: function(data){
						if(!data){
							console.error("Cannot delete null");
						} else{
							if(!data._id){
								console.error("Cannot delete an object without an _id")
							} else{
								if(angular.isArray(data)){
									angular.forEach(data, function(item, key){
										collection.remove(item._id);
									});
								}else{
									collection.remove(data._id);
								}
							}
						}
						Deps.flush();
					}
				});
				return scope[name];
			} else{
				console.error('There is no Meteor Collection called"' + name + '"')
			}
		}
	}
]);