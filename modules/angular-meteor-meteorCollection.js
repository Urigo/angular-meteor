'use strict';

var idStringify = LocalCollection._idStringify;
var idParse = LocalCollection._idParse;

// Calculates the differences between `lastSeqArray` and
// `seqArray` and calls appropriate functions from `callbacks`.
// Reuses Minimongo's diff algorithm implementation.
var diffArray = function (lastSeqArray, seqArray, callbacks) {
  var diffFn = Package.minimongo.LocalCollection._diffQueryOrderedChanges;
  var oldIdObjects = [];
  var newIdObjects = [];
  var posOld = {}; // maps from idStringify'd ids
  var posNew = {}; // ditto
  var posCur = {};
  var lengthCur = lastSeqArray.length;

  _.each(seqArray, function (doc, i) {
    newIdObjects.push({_id: doc._id});
    posNew[idStringify(doc._id)] = i;
  });
  _.each(lastSeqArray, function (doc, i) {
    oldIdObjects.push({_id: doc._id});
    posOld[idStringify(doc._id)] = i;
    posCur[idStringify(doc._id)] = i;
  });

  // Arrays can contain arbitrary objects. We don't diff the
  // objects. Instead we always fire 'changedAt' callback on every
  // object. The consumer of `observe-sequence` should deal with
  // it appropriately.
  diffFn(oldIdObjects, newIdObjects, {
    addedBefore: function (id, doc, before) {
      var position = before ? posCur[idStringify(before)] : lengthCur;

      _.each(posCur, function (pos, id) {
        if (pos >= position)
          posCur[id]++;
      });

      lengthCur++;
      posCur[idStringify(id)] = position;

      callbacks.addedAt(
        id,
        seqArray[posNew[idStringify(id)]],
        position,
        before);
    },
    movedBefore: function (id, before) {
      var prevPosition = posCur[idStringify(id)];
      var position = before ? posCur[idStringify(before)] : lengthCur - 1;

      _.each(posCur, function (pos, id) {
        if (pos >= prevPosition && pos <= position)
          posCur[id]--;
        else if (pos <= prevPosition && pos >= position)
          posCur[id]++;
      });

      posCur[idStringify(id)] = position;

      callbacks.movedTo(
        id,
        seqArray[posNew[idStringify(id)]],
        prevPosition,
        position,
        before);
    },
    removed: function (id) {
      var prevPosition = posCur[idStringify(id)];

      _.each(posCur, function (pos, id) {
        if (pos >= prevPosition)
          posCur[id]--;
      });

      delete posCur[idStringify(id)];
      lengthCur--;

      callbacks.removedAt(
        id,
        lastSeqArray[posOld[idStringify(id)]],
        prevPosition);
    }
  });

  _.each(posNew, function (pos, idString) {
    var id = idParse(idString);
    if (_.has(posOld, idString)) {
      // specifically for primitive types, compare equality before
      // firing the 'changedAt' callback. otherwise, always fire it
      // because doing a deep EJSON comparison is not guaranteed to
      // work (an array can contain arbitrary objects, and 'transform'
      // can be used on cursors). also, deep diffing is not
      // necessarily the most efficient (if only a specific subfield
      // of the object is later accessed).
      var newItem = seqArray[pos];
      var oldItem = lastSeqArray[posOld[idString]];

      if (typeof newItem === 'object' || newItem !== oldItem)
        callbacks.changedAt(id, newItem, oldItem, pos);
    }
  });
};

// Performs a deep diff between two objects.
// Returns an object with any identical keys excluded
var diffObjects = function (a, b) {
  var result = {};

  angular.forEach(a, function (value, key) {
    if (angular.equals(value, b[key]))
      return;

    result[key] = angular.isObject(value) && !angular.isArray(value) ? diffObjects(value, b[key]) : value;

    // If a nested object is identical between a and b, it is initially
    // attached as an empty object. If it was not empty from the beginning,
    // remove it from the result
    if (angular.isObject(result[key]) && Object.keys(result[key]).length === 0) {
      if (Object.keys(a[key]).length !== 0) {
        delete result[key];
      }
    }
  });

  return result;
};

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
      if (key._id) {
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
    // XXX When removing all, why not do collection.remove({})  ?
    angular.forEach(self, function (doc) {
      this.push(removeObject(doc._id, $q));
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
      var newItem = angular.extend(fields, {_id: id});
      if (before == null) {
        self.push(newItem);
      }
      else {
        var beforeIndex = _.indexOf(self, _.findWhere(self, { _id: before}));
        self.splice(beforeIndex, 0, newItem);
      }
      safeApply();
    },
    changed: function (id, fields) {
      angular.extend(_.findWhere(self, {_id: id}), fields);
      safeApply();
    },
    movedBefore: function (id, before) {
      var index = self.indexOf(_.findWhere(self, {_id: id}));
      var removed = self.splice(index, 1)[0];
      if (before == null) {
        self.push(removed);
      }
      else {
        var beforeIndex = _.indexOf(self, _.findWhere(self, { _id: before}));
        self.splice(beforeIndex, 0, removed);
      }
      safeApply();
    },
    removed: function (id) {
      var removedObject = _.findWhere(self, {_id: id});
      if (removedObject){
        self.splice(self.indexOf(removedObject), 1);
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

      var ngCollection = new AngularMeteorCollection(reactiveFunc(), $q, $meteorSubscribe, $meteorUtils, $rootScope);

      function setAutoBind() {
        if (auto) { // Deep watches the model and performs autobind.
          ngCollection.unregisterAutoBind = $rootScope.$watch(function () {
            return _.without(ngCollection, 'UPDATING_FROM_SERVER');
          }, function (newItems, oldItems) {
            if (!ngCollection.UPDATING_FROM_SERVER && newItems !== oldItems) {

              diffArray(angular.copy(oldItems), angular.copy(newItems), {
                addedAt: function (id, item, index) {
                  var newValue = angular.copy(ngCollection[index]);
                  ngCollection.unregisterAutoBind();
                  ngCollection.splice( index, 1 );
                  setAutoBind();
                  ngCollection.save(newValue);
                },
                removedAt: function (id, item, index) {
                  ngCollection.remove(id);
                },
                changedAt: function (id, newItem, oldItem, index) {
                  var diff = diffObjects(newItem, oldItem);

                  if (Object.keys(diff).length > 0 && !(Object.keys(diff).length === 1 && diff.$$hashKey)) {
                    diff._id = newItem._id;
                    ngCollection.save(diff);
                  }
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
          ngCollection.stop();
        });
        ngCollection.updateCursor(reactiveFunc());
        setAutoBind();
      });

      return ngCollection;
    }
  }]);
