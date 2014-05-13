'use strict';
var ngMeteorCollections = angular.module('ngMeteor.collections', []);

ngMeteorCollections.factory('$collection', ['$q', 'HashKeyCopier',
  function ($q, HashKeyCopier) {
    return function (collection, selector, options) {
      if (!selector) selector = {};
      if (!(collection instanceof Meteor.Collection)) {
        throw new TypeError("The first argument of $collection must be a Meteor.Collection object.");
      }
      return {
        bind: function (scope, model, auto) {
          auto = auto || false; // Sets default binding type.
          if (!(typeof auto === 'boolean')) { // Checks if auto is a boolean.
            throw new TypeError("The third argument of bind must be a boolean.");
          }

          Deps.autorun(function (self) {
            var ngCollection = new AngularMeteorCollection(collection, $q, selector, options);

            // Bind collection to model in scope. Transfer $$hashKey based on _id.
            scope[model] = HashKeyCopier.copyHashKeys(scope[model], ngCollection, ["_id"]);

            if (!scope.$$phase) scope.$apply(); // Update bindings in scope.
            scope.$on('$destroy', function () {
              self.stop(); // Stop computation if scope is destroyed.
            });
          });

          if (auto) { // Deep watches the model and performs autobind.
            scope.$watch(model, function (newItems, oldItems) {
              // Remove items that don't exist in the collection anymore.
              angular.forEach(oldItems, function (oldItem) {
                var index = newItems.map(function (item) {
                  return item._id;
                }).indexOf(oldItem._id);
                if (index == -1) newItems.remove(oldItem._id);
              });
              newItems.save(); // Saves all items.
            }, auto);
          }
        }
      };
    }
  }
]);

var AngularMeteorCollection = function (collection, $q, selector, options) {
  var self = collection.find(selector, options).fetch();

  self.__proto__ = AngularMeteorCollection.prototype;
  self.__proto__.$q = $q;
  self.$$collection = collection;

  return self;
};

AngularMeteorCollection.prototype = []; // Allows inheritance of native Array methods.

AngularMeteorCollection.prototype.save = function save(docs) {
  var self = this,
    collection = self.$$collection,
    $q = self.$q,
    promises = []; // To store all promises.

  /*
   * The upsertObject function will either update an object if the _id exists
   * or insert an object if the _id is not set in the collection.
   * Returns a promise.
   */
  function upsertObject(item, $q) {
    var deferred = $q.defer();

    item = angular.copy(item); // Makes a deep copy without the $$hashKeys.

    if (item._id) { // Performs an update if the _id property is set.
      var item_id = item._id; // Store the _id in temporary variable
      delete item._id; // Remove the _id property so that it can be $set using update.
      collection.update(item_id, {$set: item}, function (error) {
        if (error) {
          deferred.reject(error);
        } else {
          deferred.resolve({_id: item_id, action: "updated"});
        }
      });
    } else { // Performs an insert if the _id property isn't set.
      collection.insert(item, function (error, result) {
        if (error) {
          deferred.reject(error);
        } else {
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
    if (angular.isArray(docs)) { // If an array of objects were passed.
      angular.forEach(docs, function (doc) {
        this.push(upsertObject(doc, $q));
      }, promises);
    } else { // If a single object was passed.
      promises.push(upsertObject(docs, $q));
    }
  } else { // If no 'docs' argument was passed, save the entire collection.
    angular.forEach(self, function (doc) {
      this.push(upsertObject(doc, $q));
    }, promises);
  }

  return $q.all(promises); // Returns all promises when they're resolved.
};

AngularMeteorCollection.prototype.remove = function remove(keys) {
  var self = this,
    collection = self.$$collection,
    $q = self.$q,
    promises = []; // To store all promises.

  /*
   * The removeObject function will delete an object with the _id property
   * equal to the specified key.
   * Returns a promise.
   */
  function removeObject(key, $q) {
    var deferred = $q.defer();

    if (key) { // Checks if 'key' argument is set.
      if(key._id) {
        key = key._id;
      }
      collection.remove({_id: key}, function (error) {
        if (error) {
          deferred.reject(error);
        } else {
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
  if (keys) { // Checks if a 'keys' argument was passed.
    if (angular.isArray(keys)) { // If an array of keys were passed.
      angular.forEach(keys, function (key) {
        this.push(removeObject(key, $q));
      }, promises);
    } else { // If a single key was passed.
      promises.push(removeObject(keys, $q));
    }
  } else { // If no 'keys' argument was passed, save the entire collection.
    angular.forEach(self, function (doc) {
      this.push(removeObject(doc._id, $q));
    }, promises);
  }

  return $q.all(promises); // Returns all promises when they're resolved.
};