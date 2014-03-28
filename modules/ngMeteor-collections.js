var ngMeteorCollections = angular.module('ngMeteor.collections', []);

ngMeteorCollections.factory('$collection', ['$rootScope', '$q',
	function($rootScope, $q) {
		return function (collection, selector, options) {
			if (!(collection instanceof Meteor.Collection)) {
				throw new TypeError("The first argument of $collection must be a Meteor.Collection object.");
			}
			return new ngMeteorCollection(collection, $rootScope, $q, selector, options);
		}
	}
]);

ngMeteorCollection = function(collection, $rootScope, $q, selector, options) {
	var self = [];

	self.__proto__ = ngMeteorCollection.prototype;
	self.__proto__.$q = $q;
	self.$$collection = collection;

	if (!selector) selector = {}; // Set default selector if none is passed in the arguments.

	// Run whenever dependency changes.
	Deps.autorun(function() {
		var items = collection.find(selector, options).fetch(); // Get updated collection objects.

		// Check if the collection has changed.
		if (!angular.equals(self, items)) {
			var oldSelf = self.slice(0); // Makes a deep copy with $$hashKeys

			self.length = 0; // Empty the array so objects can be pushed to it.
			
			// Check for existing objects to update.
			if (oldSelf.length > 0) {
				angular.forEach(oldSelf, function(obj){
					if (obj._id){
						// Get an array of _ids in the collection.
						var index = items.map(function(item) { return item._id; }).indexOf(obj._id); 

						// Check if an object with that _id still exists in the collection. 
						// If it doesn't exist, the object must've been removed
						// so there would be no need to push the object again.
						if (index >= 0) { 
							var item = items[index]; // Get the updated object from the collection.
							items.splice(index,1); // Remove the object from the collection so it isn't pushed as a new object later.
							if (obj.$$hashKey) item["$$hashKey"] = obj.$$hashKey; // Transfer existing $$hashKey.
							self.push(item); // Push updated object.
						}
					} else { 
						// Simply push the object if it isn't part of the collection
						// because it is part of the local model yet to be saved. 
						self.push(obj);
					}
				});
			}

			// Push all the new objects in the collection.
			angular.forEach(items, function(item) {
				self.push(item);
			});

			// Update bindings from the $rootScope down.
			if(!$rootScope.$$phase) $rootScope.$apply();
		}
	});

	return self;
}

ngMeteorCollection.prototype = new Array;

ngMeteorCollection.prototype.save = function save (docs) {
	var self = this,
		collection = self.$$collection,
		$q = self.$q,
		promises = []; // To store all promises.

	/*
	* The upsert function will either update an object if the _id exists
	* or insert an object if the _id is not set in the collection.
	* Returns a promise.
	*/
	upsert = function (item, $q) {
		var deferred = $q.defer();

		item = angular.copy(item); // Makes a deep copy without the $$hashKeys.

		if (item._id) { // Performs an update if the _id property is set.
			var item_id = item._id; // Store the _id in temporary variable
			delete item._id; // Remove the _id property so that it can be $set using update.
			collection.update(item_id, {$set: item}, function(error, result) {
				if(error) {
					deferred.reject(error);
				}else{
					deferred.resolve({_id: item_id, action: "updated"});
				}
			});
		} else { // Performs an insert if the _id property isn't set.
			collection.insert(item, function(error, result) {
				if(error) {
					deferred.reject(error);
				}else{
					deferred.resolve({_id: result, action: "inserted"});
				}
			});
		}

		return deferred.promise;
	}

	/*
	* How to update the collection depending on the 'docs' argument passed.
	*/
	if (docs) { // Checks if a 'docs' argument was passed.
		if(angular.isArray(docs)) { // If an array of objects were passed.
			angular.forEach(docs, function(doc) {
				this.push(upsert(doc, $q));
			}, promises);
		}else{ // If a single object was passed.
			promises.push(upsert(docs, $q));
		}
	} else { // If no 'docs' argument was passed, save the entire collection.
		angular.forEach(self, function(doc) {
			this.push(upsert(doc, $q));
		}, promises);
	}

	return $q.all(promises); // Returns all promises when they're resolved.
}

ngMeteorCollection.prototype.remove = function remove (keys) {
	var self = this,
		collection = self.$$collection,
		$q = self.$q,
		promises = []; // To store all promises.

	/*
	* The remove function will delete an object with the _id property
	* equal to the specified key.
	* Returns a promise.
	*/
	remove = function (key, $q) {
		var deferred = $q.defer();

		if (key) { // Checks if 'key' argument is set.
			collection.remove(key, function(error, result) {
				if(error) {
					deferred.reject(error);
				}else{
					deferred.resolve({_id: key, action: "removed"});
				}
			});
		} else {
			deferred.reject("key cannot be null");
		}

		return deferred.promise;
	}

	/*
	* What to remove from collection depending on the 'keys' argument passed.
	*/
	if (docs) { // Checks if a 'docs' argument was passed.
		if(angular.isArray(keys)) { // If an array of keys were passed.
			angular.forEach(keys, function(key) {
				this.push(remove(key, $q));
			}, promises);
		}else{ // If a single key was passed.
			promises.push(remove(keys, $q));
		}
	} else { // If no 'keys' argument was passed, save the entire collection.
		angular.forEach(self, function(doc) {
			this.push(remove(doc._id, $q));
		}, promises);
	}

	return $q.all(promises); // Returns all promises when they're resolved.
}

ngMeteorCollection.prototype.bind = function bind () {
	// All changes to the object will be automatically synced to the database.
}