'use strict';

var collectionUtils = {};

var angularMeteorCollection = angular.module('angular-meteor.collection',
  ['angular-meteor.stopper', 'angular-meteor.subscribe', 'angular-meteor.utils', 'diffArray']);

// The reason angular meteor collection is a factory function and not something
// that inherit from array comes from here:
// http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/
// We went with the direct extensions approach
angularMeteorCollection.factory('AngularMeteorCollection', [
  '$q', '$meteorSubscribe', '$meteorUtils', '$rootScope', '$timeout', 'diffArray',
  function ($q, $meteorSubscribe, $meteorUtils, $rootScope, $timeout, diffArray) {
    var deepCopyChanges = diffArray.deepCopyChanges;
    var deepCopyRemovals = diffArray.deepCopyRemovals;

    function AngularMeteorCollection (cursor, collection, diffArrayFunc) {
      var data = [];
      data._serverBackup = [];
      data.diffArrayFunc = diffArrayFunc;

      if (angular.isDefined(collection))
        data.$$collection = collection;
      else
        data.$$collection = $meteorUtils.getCollectionByName(cursor.collection.name);

      angular.extend(data, AngularMeteorCollection);
      return data;
    }

    AngularMeteorCollection.subscribe = function () {
      $meteorSubscribe.subscribe.apply(this, arguments);
      return this;
    };

    AngularMeteorCollection.save = function (docs, useUnsetModifier) {
      // save whole collection
      if (!docs) docs = this;
      // save single doc
      docs = [].concat(docs);

      var promises = docs.map(function (doc) {
        return this._upsertDoc(doc, useUnsetModifier);
      }, this);

      var allPromise = $q.all(promises);

      allPromise.finally(function() {
        // calls digestion loop with no conflicts
        $timeout(angular.noop);
      });

      return allPromise;
    };

    AngularMeteorCollection._upsertDoc = function(doc, useUnsetModifier) { 
      var deferred = $q.defer();
      var collection = this.$$collection;

      // delete $$hashkey
      doc = $meteorUtils.stripDollarPrefixedKeys(doc);

      function onComplete(docId, error, action) {
        if (error)
          deferred.reject(error);
        else
          deferred.resolve({_id: docId, action: action});
      }

      // update
      var docId = doc._id;
      if (docId) {
        // Deletes _id property (from the copy) so that
        // it can be $set using update.
        delete doc._id;
        var modifier;
        if (useUnsetModifier)
          modifier = { $unset: doc };
        else
          modifier = { $set: doc };

        collection.update(docId, modifier, function (error) {
          onComplete(docId, error, 'updated');
        });
      } else {
        // insert
        collection.insert(doc, function (error, docId) {
          onComplete(docId, error, 'inserted');
        });
      }

      return deferred.promise;
    };

    AngularMeteorCollection.remove = function (keyOrDocs) {
      var keys;
      // remove whole collection
      if (!keyOrDocs) {
        keys = _.pluck(this, '_id');
      } else {
        // remove docs
        keys = _.map([].concat(keyOrDocs), function(keyOrDoc) {
          return keyOrDoc._id || keyOrDoc;
        });
      }
      // Checks if all keys are correct.
      check(keys, [Match.OneOf(String, Mongo.ObjectID)]);

      var promises = keys.map(function (key) {
        return this._removeDoc(key);
      }, this);

      var allPromise = $q.all(promises);

      allPromise.finally(function() {
        $timeout(angular.noop);
      });

      return allPromise;
    };

    AngularMeteorCollection._removeDoc = function(id) {
      var deffered = $q.defer();
      var collection = this.$$collection;

      collection.remove(id, function(err) {
        if (err)
          deffered.reject(err);
        else
          deffered.resolve({_id: id, action: 'removed'});
      });

      return deffered.promise;
    };

    AngularMeteorCollection.updateCursor = function (cursor) {
      var self = this;

      // XXX - consider adding an option for a non-orderd result
      // for faster performance.
      if (self.observeHandle) {
        this.observeHandle.stop();
      }

      var applyPromise = null;
      this.observeHandle = cursor.observe({
        addedAt: function (doc, atIndex) {
          self.splice(atIndex, 0, doc);
          self._serverBackup.splice(atIndex, 0, doc);
          applyPromise = self._safeApply(applyPromise);
        },

        changedAt: function (doc, oldDoc, atIndex) {
          deepCopyChanges(self[atIndex], doc);
          deepCopyRemovals(self[atIndex], doc);
          self._serverBackup[atIndex] = self[atIndex];
          applyPromise = self._safeApply(applyPromise);
        },

        movedTo: function (doc, fromIndex, toIndex) {
          self.splice(fromIndex, 1);
          self.splice(toIndex, 0, doc);
          self._serverBackup.splice(fromIndex, 1);
          self._serverBackup.splice(i, 0, doc);
          applyPromise = self._safeApply(applyPromise);
        },

        removedAt: function (oldDoc) {
          var removedIndex = collectionUtils.findIndexById(self, oldDoc);

          if (removedIndex != -1) {
            self.splice(removedIndex, 1);
            self._serverBackup.splice(removedIndex, 1);
            applyPromise = self._safeApply(applyPromise);
          } else {
            // If it's been removed on client then it's already not in collection
            // itself but still is in the _serverBackup.
            removedIndex = collectionUtils.findIndexById(self._serverBackup, oldDoc);

            if (removedIndex != -1) {
              self._serverBackup.splice(removedIndex, 1);
            }
          }
        }
      });
    };

    // Function applies multiple operations (savings, deletions etc) once
    // with the help of $timeout.
    AngularMeteorCollection._safeApply = function(promise) {
      var self = this;

      if (promise) {
        $timeout.cancel(promise);
      }

      // Clearing the watch is needed so no updates are sent to server
      // while handling updates from the server.
      if (!this.UPDATING_FROM_SERVER) {
        this.UPDATING_FROM_SERVER = true;
        if (!$rootScope.$$phase) $rootScope.$apply();
      }

      return $timeout(function () {
        // Saves changes happened within the previous update from server.
        collectionUtils.updateCollection(self, self._serverBackup, self.diffArrayFunc);
        self.UPDATING_FROM_SERVER = false;
      }, 50);
    };

    AngularMeteorCollection.stop = function () {
      if (this._unregisterAutoBind) {
        this._isAutoBind = false;
        this._unregisterAutoBind();
      }

      if (this.observeHandle)
        this.observeHandle.stop();

      this.splice(0);
      this._serverBackup.splice(0);
    };

    AngularMeteorCollection.setAutoBind = function() {
      this._isAutoBind = true;

      var self = this;
      this._unregisterAutoBind = $rootScope.$watch(function () {
        if (self.UPDATING_FROM_SERVER) {
          return 'UPDATING_FROM_SERVER';
        }
        delete self.UPDATING_FROM_SERVER;
        return self;
      }, function (items, oldItems) {
        if (self._isAutoBind == false) return;
        if (items === 'UPDATING_FROM_SERVER' || oldItems === 'UPDATING_FROM_SERVER') return;
        if (items === oldItems) return;

        self._isAutoBind = false;
        self._unregisterAutoBind();
        collectionUtils.updateCollection(self, oldItems, self.diffArrayFunc);
        self.setAutoBind();
      }, true);
    };

    return AngularMeteorCollection;
}]);

angularMeteorCollection.factory('$meteorCollectionFS', ['$meteorCollection', 'diffArray',
  function ($meteorCollection, diffArray) {
    function $meteorCollectionFS(reactiveFunc, auto, collection) {
      return new $meteorCollection(reactiveFunc, auto, collection, noNestedDiffArray);
    }

    var noNestedDiffArray = function (lastSeqArray, seqArray, callbacks) {
      return diffArray(lastSeqArray, seqArray, callbacks, true);
    };

    return $meteorCollectionFS;
}]);


angularMeteorCollection.factory('$meteorCollection', [
  'AngularMeteorCollection', '$rootScope', 'diffArray',
  function (AngularMeteorCollection, $rootScope, diffArray) {
    function $meteorCollection(reactiveFunc, autoBind, collection, diffArrayFunc) {
      // Validate parameters
      if (!reactiveFunc) {
        throw new TypeError('The first argument of $meteorCollection is undefined.');
      }

      if (!(angular.isFunction(reactiveFunc) || angular.isFunction(reactiveFunc.find))) {
        throw new TypeError(
          'The first argument of $meteorCollection must be a function or\
            a have a find function property.');
      }

      if (!(angular.isFunction(reactiveFunc))) {
        collection = angular.isDefined(collection) ? collection : reactiveFunc;
        reactiveFunc = _.bind(reactiveFunc.find, reactiveFunc);
      }

      var ngCollection = new AngularMeteorCollection(reactiveFunc(),
        collection, diffArrayFunc || diffArray);
      angular.extend(ngCollection, $meteorCollection);

      // By default auto - true.
      autoBind = angular.isDefined(autoBind) ? autoBind : true;
      // Fetches the latest data from Meteor and update the data variable.
      Tracker.autorun(function () {
        // When the reactive func gets recomputated we need to stop any previous
        // observeChanges.
        Tracker.onInvalidate(function () {
          ngCollection.stop();
        });

        ngCollection.updateCursor(reactiveFunc());
        if (autoBind)
          ngCollection.setAutoBind();
      });

      return ngCollection;
    }

    return $meteorCollection;
 }]);

angularMeteorCollection.run([
  '$rootScope', '$meteorCollection', '$meteorCollectionFS', '$meteorStopper',
  function ($rootScope, $meteorCollection, $meteorCollectionFS, $meteorStopper) {
    var scopeProto = Object.getPrototypeOf($rootScope);
    scopeProto.$meteorCollection = $meteorStopper($meteorCollection);
    scopeProto.$meteorCollectionFS = $meteorStopper($meteorCollectionFS);
 }]);

// Local utilities

collectionUtils.findIndexById = function (collection, doc) {
  var id = doc._id;

  var foundDoc = _.find(collection, function(candiDoc) {
    // EJSON.equals used to compare Mongo.ObjectIDs and Strings.
    return EJSON.equals(candiDoc._id, id);
  });

  return _.indexOf(collection, foundDoc);
};

// Finds changes between two collections and saves difference into first one.
collectionUtils.updateCollection = function(newCollection, oldCollection, diffMethod) {
  var addedCount = 0;

  diffMethod(oldCollection, newCollection, {
    addedAt: function (id, item, index) {
      var newValue = newCollection.splice(index - addedCount, 1).pop();
      newCollection.save(newValue);
      addedCount++;
    },

    removedAt: function (id, item, index) {
      newCollection.remove(id);
    },

    changedAt: function (id, setDiff, unsetDiff, index, oldItem) {
      if (setDiff)
        newCollection.save(setDiff);
      if (unsetDiff)
        newCollection.save(unsetDiff, true);
    },

    movedTo: function (id, item, fromIndex, toIndex) {
      // XXX do we need this?
    }
  });
};
