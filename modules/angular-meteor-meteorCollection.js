'use strict';
var angularMeteorCollections = angular.module('angular-meteor.meteor-collection', []);

var CollectionData = function($subscribe) {
  this.__proto__.$subscribe = $subscribe;
};

CollectionData.prototype = [];

CollectionData.prototype.subscribe = function() {
  this.$subscribe.subscribe.apply(this, arguments);
  return this;
};

var AngularMeteorCollection = function (cursor, $q, $rootScope, $subscribe) {
  this.data = new CollectionData($subscribe);
  this.$$collection = cursor.collection;
  this.__proto__.$q = $q;
  this.__proto__.$rootScope = $rootScope;
  this.updateCursor(cursor);

  return this;
};

AngularMeteorCollection.prototype.updateCursor = function(cursor) {
  var self = this;

  function safeApply() {
    // Clearing the watch is need so no updates are sent to server
    // while handling updates from the server
    self.UPDATING_FROM_SERVER = true;
    if (!self.$rootScope.$$phase) self.$rootScope.$apply();
    self.UPDATING_FROM_SERVER = false;
  }

  // XXX - consider adding an option for a non-orderd result
  // for faster performance
  if (self.observeHandle) {
    self.observeHandle.stop();
  }
  self.observeHandle = cursor.observeChanges ({
    addedBefore : function(id, fields, before) {
      var newItem = angular.extend(fields, { _id : id });
      if (before == null) {
        self.data.push(newItem);
      }
      else {
        self.data.splice(before, 0, newItem);
      }
      safeApply();
    },
    changed : function(id, fields) {
      angular.extend(_.findWhere(self.data, { _id : id }), fields);
      safeApply();
    },
    movedBefore : function(id, before) {
      var index = self.data.indexOf(_.findWhere(self.data, { _id : id }));
      var removed = self.data.splice(index, 1)[0];
      if (before == null) {
        self.data.push(removed);
      }
      else {
        self.data.splice(before, 0, removed);
      }
      safeApply();
    },
    removed : function(id) {
      self.data.splice(self.data.indexOf(_.findWhere(self.data, { _id : id })), 1);
      safeApply();
    }
  });
};

AngularMeteorCollection.prototype.stop = function() {
  this.unregisterAutoBind();
  this.observeHandle.stop();
  while(this.data.length > 0) {
    this.data.pop();
  }
};

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

    item = angular.copy(item);
    delete item.$$hashKey;
    for (var property in item) {
      delete property.$$hashKey;
    }

    if (item._id) { // Performs an update if the _id property is set.
      var item_id = item._id; // Store the _id in temporary variable
      delete item._id; // Remove the _id property so that it can be $set using update.
      var objectId = (item_id._str) ? new Meteor.Collection.ObjectID(item_id._str) : item_id;
      collection.update(objectId, {$set: item}, function (error) {
        if (error) {
          deferred.reject(error);
        } else {
          deferred.resolve({_id: objectId, action: "updated"});
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
      var objectId = (key._str) ? new Meteor.Collection.ObjectID(key._str) : key;
      collection.remove(objectId, function (error) {
        if (error) {
          deferred.reject(error);
        } else {
          deferred.resolve({_id: objectId, action: "removed"});
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

angularMeteorCollections.factory('$meteorCollection', ['$rootScope', '$q', '$subscribe',
  function($rootScope, $q, $subscribe) {
    return function(reactiveFunc, auto) {
      // Validate parameters
      if (!(typeof reactiveFunc == "function" || reactiveFunc instanceof Mongo.Collection)) {
        throw new TypeError("The first argument of $meteorCollection must be a function or a Mongo.Collection.");
      }
      auto = auto !== false;
      if (!(typeof auto === 'boolean')) { // Checks if auto is a boolean.
        throw new TypeError("The second argument of bind must be a boolean.");
      }

      if (reactiveFunc instanceof Mongo.Collection) {
        var collection = reactiveFunc;
        reactiveFunc  = function() {
          return collection.find({});
        }
      }

      var ngCollection = new AngularMeteorCollection(reactiveFunc(), $q, $rootScope, $subscribe);

      function setAutoBind() {
        if (auto) { // Deep watches the model and performs autobind.
          ngCollection.unregisterAutoBind = $rootScope.$watch(function () {
            ngCollection.data;
          }, function (newItems, oldItems) {
            if (!ngCollection.UPDATING_FROM_SERVER && newItems !== oldItems) {
              // Remove items that don't exist in the collection anymore.
              angular.forEach(oldItems, function (oldItem) {
                var index = newItems.map(function (item) {
                  return item._id;
                }).indexOf(oldItem._id);
                if (index == -1) { // To here get all objects that pushed or spliced
                  var localIndex;
                  if (!oldItem._id)
                    localIndex = -1;
                  else if (oldItem._id && !oldItem._id._str)
                    localIndex = -1;
                  else {
                    localIndex = newItems.map(function (item) {
                      if (item._id)
                        return item._id._str;
                    }).indexOf(oldItem._id._str);
                  }
                  if (localIndex == -1) {
                    if (oldItem._id) { // This is a check to get only the spliced objects
                      ngCollection.remove(oldItem._id);
                    }
                  }
                }
              });
              ngCollection.save(); // Saves all items.
            }
          }, true);
        }
      }

      /**
       * Fetches the latest data from Meteor and update the data variable.
       */
      Tracker.autorun(function () {
        // When the reactive func gets recomputated we need to stop any previous
        // observeChanges
        Tracker.onInvalidate(function() {
          //ngCollection.UPDATING_FROM_SERVER = true;
          ngCollection.stop();
        });
        //ngCollection.UPDATING_FROM_SERVER = false;
        ngCollection.updateCursor(reactiveFunc());
        setAutoBind();
      });

      return ngCollection.data;
    }
  }]);