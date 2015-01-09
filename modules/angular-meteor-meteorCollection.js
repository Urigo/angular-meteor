'use strict';

var angularMeteorCollections = angular.module('angular-meteor.meteor-collection',
  ['angular-meteor.subscribe', 'angular-meteor.utils']);


var AngularMeteorCollection = function (cursor, $q, $meteorSubscribe, $meteorUtils, $rootScope) {

  var self = [];

  self.__proto__ = AngularMeteorCollection.prototype;
  self.__proto__.$q = $q;
  self.__proto__.$meteorSubscribe = $meteorSubscribe;
  self.__proto__.$rootScope = $rootScope;

  self.$$collection = $meteorUtils.getCollectionByName(cursor.collection.name);

  return self;
};

AngularMeteorCollection.prototype = [];

AngularMeteorCollection.prototype.subscribe = function () {
  var self = this;
  self.$meteorSubscribe.subscribe.apply(this, arguments);
  return this;
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
      self.CLIENT_UPDATING = true;
      collection.update(objectId, {$set: item}, function (error) {
        self.CLIENT_UPDATING = false;
        if (error) {
          deferred.reject(error);
        } else {
          deferred.resolve({_id: objectId, action: "updated"});
        }
      });
    } else { // Performs an insert if the _id property isn't set.
      self.CLIENT_UPDATING = true;
      collection.insert(item, function (error, result) {
        self.CLIENT_UPDATING = false;
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
        var currentPromise = upsertObject(doc, $q);
        currentPromise.then(function(result){
          if (result.action == "inserted")
            doc._id = result._id;
        });
        this.push(currentPromise);
      }, promises);
    } else { // If a single object was passed.
      var currentPromise = upsertObject(docs, $q);
      currentPromise.then(function(result){
        if (result.action == "inserted"){
          docs._id = result._id;
          self.push(docs);
        }
      });
      promises.push(currentPromise);
    }
  } else { // If no 'docs' argument was passed, save the entire collection.
    angular.forEach(_.without(self, 'CLIENT_UPDATING'), function (doc) {
      var currentPromise = upsertObject(doc, $q);
      currentPromise.then(function(result){
        if (result.action == "inserted")
          doc._id = result._id;
      });
      this.push(currentPromise);
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
      if (key._id) {
        key = key._id;
      }
      var objectId = (key._str) ? new Meteor.Collection.ObjectID(key._str) : key;
      self.CLIENT_UPDATING = true;
      collection.remove(objectId, function (error) {
        self.CLIENT_UPDATING = false;
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
        var currentPromise = removeObject(key, $q);
        currentPromise.then(function(result){
          if (result.action == "removed"){
            var deletedItemIndex = self.indexOf(_.findWhere(self, {_id: result._id}));
            if (deletedItemIndex != -1)
              self.splice(self.indexOf(_.findWhere(self, {_id: result._id})), 1);
          }
        }, function(error){
          self.push(collection.findOne(key));
        });
        this.push(currentPromise);
      }, promises);
    } else { // If a single key was passed.
      var currentPromise = removeObject(keys, $q);
      currentPromise.then(function(result){
        if (result.action == "removed"){
          var deletedItemIndex = self.indexOf(_.findWhere(self, {_id: result._id}));
          if (deletedItemIndex != -1)
            self.splice(self.indexOf(_.findWhere(self, {_id: result._id})), 1);
        }
      }, function(error){
        self.push(collection.findOne(keys));
      });
      promises.push(currentPromise);
    }
  } else { // If no 'keys' argument was passed, save the entire collection.
    angular.forEach(_.without(self, 'CLIENT_UPDATING'), function (doc) {
      var currentPromise = removeObject(doc._id, $q);
      currentPromise.then(function(result){
        if (result.action == "removed"){
          var deletedItemIndex = self.indexOf(_.findWhere(self, {_id: result._id}));
          if (deletedItemIndex != -1)
            self.splice(self.indexOf(_.findWhere(self, {_id: result._id})), 1);
        }
      }, function(error){
        self.push(collection.findOne(doc._id));
      });
      this.push(currentPromise);
    }, promises);
  }

  return $q.all(promises); // Returns all promises when they're resolved.
};

AngularMeteorCollection.prototype.updateCursor = function (cursor) {
  var self = this,
    $rootScope = self.$rootScope;

  function safeApply() {
    // Clearing the watch is needed so no updates are sent to server
    // while handling updates from the server
    self.UPDATING_FROM_SERVER = true;
    if (!$rootScope.$$phase) $rootScope.$apply();
    self.UPDATING_FROM_SERVER = false;
  }

  // XXX - consider adding an option for a non-orderd result
  // for faster performance
  if (self.observeHandle) {
    self.observeHandle.stop();
  }

  self.observeHandle = cursor.observeChanges({
    addedBefore: function (id, fields, before) {
      if (!self.CLIENT_UPDATING) {
        var newItem = angular.extend(fields, {_id: id});
        if (before == null) {
          self.push(newItem);
        }
        else {
          var beforeIndex = _.indexOf(self, _.findWhere(self, { _id: id}));
          self.splice(beforeIndex, 0, newItem);
        }
        safeApply();
      }
    },
    changed: function (id, fields) {
      if (!self.CLIENT_UPDATING) {
        angular.extend(_.findWhere(self, {_id: id}), fields);
        safeApply();
      }
    },
    movedBefore: function (id, before) {
      if (!self.CLIENT_UPDATING) {
        var index = self.indexOf(_.findWhere(self, {_id: id}));
        var removed = self.splice(index, 1)[0];
        if (before == null) {
          self.push(removed);
        }
        else {
          var beforeIndex = _.indexOf(self, _.findWhere(self, { _id: id}));
          self.splice(beforeIndex, 0, removed);
        }
        safeApply();
      }
    },
    removed: function (id) {
      if (!self.CLIENT_UPDATING) {
        self.splice(self.indexOf(_.findWhere(self, {_id: id})), 1);
        safeApply();
      }
    }
  });
};

AngularMeteorCollection.prototype.stop = function () {
  if (this.unregisterAutoBind)
    this.unregisterAutoBind();

  this.observeHandle.stop();
  while (this.length > 0) {
    this.pop();
  }
};


angularMeteorCollections.factory('$meteorCollection', ['$q', '$meteorSubscribe', '$meteorUtils', '$rootScope',
  function ($q, $meteorSubscribe, $meteorUtils, $rootScope) {
    return function (reactiveFunc, auto) {
      // Validate parameters
      if (!reactiveFunc) {
        throw new TypeError("The first argument of $meteorCollection is undefined.");
      }
      if (!(typeof reactiveFunc == "function" || reactiveFunc instanceof Mongo.Collection)) {
        throw new TypeError("The first argument of $meteorCollection must be a function or a Mongo.Collection.");
      }
      auto = auto !== false;

      if (reactiveFunc instanceof Mongo.Collection) {
        var collection = reactiveFunc;
        reactiveFunc = function() {
          return collection.find({});
        }
      }

      var itemAddedDep = new Tracker.Dependency();

      var ngCollection = new AngularMeteorCollection(reactiveFunc(), $q, $meteorSubscribe, $meteorUtils, $rootScope);

      function setAutoBind() {
        if (auto) { // Deep watches the model and performs autobind.
          ngCollection.unregisterAutoBind = $rootScope.$watch(function () {
            return _.without(ngCollection, 'CLIENT_UPDATING', 'UPDATING_FROM_SERVER');
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
              ngCollection.save().then(function() { // Saves all items.
                if(newItems.length > oldItems.length) {
                  itemAddedDep.changed();
                }
              });
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
        Tracker.onInvalidate(function () {
          //ngCollection.UPDATING_FROM_SERVER = true;
          ngCollection.stop();
        });
        //ngCollection.UPDATING_FROM_SERVER = false;
        ngCollection.updateCursor(reactiveFunc());
        setAutoBind();

        itemAddedDep.depend();
      });

      return ngCollection;
    }
  }]);