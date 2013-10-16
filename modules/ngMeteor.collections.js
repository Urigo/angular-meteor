var ngMeteorCollections = angular.module('ngMeteor.collections', []);

ngMeteorCollections.factory('$collection', function($window, $rootScope){
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
					if(!data){
						console.error("Cannot add null");
					} else{
						if(!data._id){
							collection.insert(data);
						}else{
							collection.update(data._id, data);
						}
					}
					Deps.flush();
				},
				delete: function(data){
					if(!data){
						console.error("Cannot delete null");
					} else{
						collection.remove(data._id);
					}
					Deps.flush();
				}
			});
			return scope[name];
		} else{
			console.error('There is no Meteor Collection called"' + name + '"')
		}
	}
});