var ngMeteorCollections = angular.module('ngMeteor.collections', []);

ngMeteorCollections.factory('$collection', ['$window', '$rootScope', 'HashKeyCopier', '$q',
	function($window, $rootScope, HashKeyCopier, $q){
		return function (name, scope, selector, options, publisher) {
			var collection = $window[name];
			if(!selector) selector = {};
			if(collection instanceof Meteor.Collection){
				Deps.autorun(function(){
					var subscription = Meteor.subscribe(name, selector, options, publisher);
					scope[name] = HashKeyCopier.copyHashKeys(scope[name],collection.find(selector, options).fetch(),["_id"]);
					if(!scope.$$phase){scope.$apply()} // I think this bit is redundant now.

					// Temporary Fix
					//===================================================================
					scope[name].ready = function(fn){
						var deferred = $q.defer();

						isReady = setInterval(function() {
					        if ( subscription.ready() ) {
					        	deferred.resolve('ready');
					        	clearInterval(isReady);
					        } else {
					        	deferred.reject('not ready');
					        }
					    }, 100);

					    deferred.promise.then(function(){
					    	fn();
					    });
					}
					scope[name].add = function(data){
						data = angular.copy(data);
						upsert = function(item){
							if(!item._id){
								collection.insert(item);
							}else{
								var item_id = item._id;
								delete item._id;
								collection.update(item_id, {$set: item});
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
					}
					scope[name].delete = function(data){
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
					//===================================================================

				});
				return scope[name];
			} else{
				console.error('There is no Meteor Collection called "' + name + '"')
			}
		}
	}
]);
