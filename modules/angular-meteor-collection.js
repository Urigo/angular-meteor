'use strict';

var collectionUtils = {};

var angularMeteorCollection = angular.module('angular-meteor.collection',
  ['angular-meteor.stopper', 'angular-meteor.subscribe', 'angular-meteor.utils', 'diffArray']);

// The reason angular meteor collection is a factory function and not something
// that inherit from array comes from here: http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/
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
        data.$$collection =  $meteorUtils.getCollectionByName(cursor.collection.name);

      angular.extend(data, AngularMeteorCollection);
      return data;
    }

    AngularMeteorCollection.subscribe = function () {
      $meteorSubscribe.subscribe.apply(this, arguments);
      return this;
    };

    AngularMeteorCollection.save = function (docs, useUnsetModifier) {
      // save collection
      if (!docs) docs = this;
      // save single doc
      docs = [].concat(docs);

      var promises = docs.map(function (doc) {
        return this.upsertObject(doc, useUnsetModifier);
      }, this);

      var allPromise = $q.all(promises);

      allPromise.finally(function() {
        // calls digestion loop with no conflicts
        $timeout(angular.noop);
      });

      return allPromise;
    };

    AngularMeteorCollection.remove = function (keys) {
      // remove collection
      if (!keys) _.pluck(this, '_id');
      // remove single doc
      keys = [].concat(keys);

      var promises = keys.map(function (key) {
        return this.removeObject(key);
      }, this);

      var allPromise = $q.all(promises);

      allPromise.finally(function() {
        $timeout(angular.noop);
      });

      return allPromise;
    };

    AngularMeteorCollection.updateCursor = function (cursor) {
      var self = this;
      this._applyPromise = null;

      // XXX - consider adding an option for a non-orderd result
      // for faster performance
      if (self.observeHandle) {
        this.observeHandle.stop();
      }

      this.observeHandle = cursor.observe({
        addedAt: function (doc, atIndex) {
          self.splice(atIndex, 0, doc);
          self._serverBackup.splice(atIndex, 0, doc);
          self.safeApply();
        },

        changedAt: function (doc, oldDoc, atIndex) {
          deepCopyChanges(self[atIndex], doc);
          deepCopyRemovals(self[atIndex], doc);
          self._serverBackup[atIndex] = self[atIndex];
          self.safeApply();
        },

        movedTo: function (doc, fromIndex, toIndex) {
          self.splice(fromIndex, 1);
          self.splice(toIndex, 0, doc);
          self._serverBackup.splice(fromIndex, 1);
          self._serverBackup.splice(i, 0, doc);
          self.safeApply();
        },

        removedAt: function (oldDoc) {
          var removedIndex = collectionUtils.findIndexById(self, oldDoc);

          if (removedIndex != -1) {
            self.splice(removedIndex, 1);
            self._serverBackup.splice(removedIndex, 1);
            self.safeApply();
          } 

          else {
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

    AngularMeteorCollection.stop = function () {
      if (this.unregisterAutoBind){
        this._isAutoBind = false;
        this.unregisterAutoBind();
      }

      if (this.observeHandle)
        this.observeHandle.stop();

      this.splice(0);
      this._serverBackup.splice(0);
    };

    AngularMeteorCollection.upsertObject = function(item, useUnsetModifier) { 
      var deferred = $q.defer();
      var collection = this.$$collection;
      var id = item._id;
      delete item._id;

      // delete $$hashkey
      item = $meteorUtils.stripDollarPrefixedKeys(item);

      // update
      if (id) {
        var modifier;

        if (useUnsetModifier)
          modifier = { $unset: item };
        else
          modifier = { $set: item };

        collection.update(id, modifier, function (err) {
          if (err)
            deferred.reject(err);
          else
            deferred.resolve({_id: id, action: 'updated'});

          $rootScope.$apply();
        });
      }

      // insert
      else {
        collection.insert(item, function (err, result) {
          if (err)
            deferred.reject(err);
          else
            deferred.resolve({_id: result, action: 'inserted'});
          
          $rootScope.$apply();
        });
      }

      return deferred.promise;
    };

    // key is either doc, id, or string
    AngularMeteorCollection.removeObject = function(key) {
      var deffered = $q.defer();
      var collection = this.$$collection;
      var id = key._id || key;

      check(id, Match.OneOf(String, Mongo.ObjectID));

      collection.remove(id, function(err) {
        if (err)
          deffered.reject(err);
        else
          deffered.resolve({_id: id, action: 'removed'});

        $rootScope.$apply();
      });

      return deffered.promise;
    };

    // Function applies .safeApply to combine multiple operations (savings, deletions etc)
    // in one processing.
    AngularMeteorCollection.safeApply = function() {
      var self = this;

      if (this._applyPromise) {
        $timeout.cancel(this._applyPromise);
        this._applyPromise = null;
      }

      // Clearing the watch is needed so no updates are sent to server
      // while handling updates from the server.
      if (!this.UPDATING_FROM_SERVER) {
        this.UPDATING_FROM_SERVER = true;
        if (!$rootScope.$$phase) $rootScope.$apply();
      }

      this._applyPromise = $timeout(function () {
        // Saves changes happened within the previous update from server.
        collectionUtils.updateCollection(self, self._serverBackup, self.diffArrayFunc);
        self.UPDATING_FROM_SERVER = false;
      }, 50);
    };

    return AngularMeteorCollection;
}]);

angularMeteorCollection.factory('$meteorCollectionFS', ['$meteorCollection', 'diffArray',
  function ($meteorCollection, diffArray) {
    function $meteorCollectionFS(reactiveFunc, auto, collection) {
      var noNestedDiffArray = function (lastSeqArray, seqArray, callbacks) {
        return diffArray(lastSeqArray, seqArray, callbacks, true);
      };

      return new $meteorCollection(reactiveFunc, auto, collection, noNestedDiffArray);
    }

    return $meteorCollectionFS;
}]);


angularMeteorCollection.factory('$meteorCollection', [
  'AngularMeteorCollection', '$rootScope', 'diffArray',
  function (AngularMeteorCollection, $rootScope, diffArray) {
    function $meteorCollection(reactiveFunc, auto, collection, diffArrayFunc) {
      // Validate parameters
      if (!reactiveFunc) {
        throw new TypeError('The first argument of $meteorCollection is undefined.');
      }

      if (!(angular.isFunction(reactiveFunc) || angular.isFunction(reactiveFunc.find))) {
        throw new TypeError('The first argument of $meteorCollection must be a function or a have a find function property.');
      }

      if (!(angular.isFunction(reactiveFunc))) {
        collection = angular.isDefined(collection) ? collection : reactiveFunc;
        reactiveFunc = _.bind(reactiveFunc.find, reactiveFunc);
      }

      diffArrayFunc = diffArrayFunc || diffArray;
      var ngCollection = new AngularMeteorCollection(reactiveFunc(), collection, diffArrayFunc);
      ngCollection._auto = auto !== false;
      ngCollection.diffArrayFunc = diffArrayFunc || diffArray;
      angular.extend(ngCollection, $meteorCollection);

      // Fetches the latest data from Meteor and update the data variable.
      Tracker.autorun(function () {
        // When the reactive func gets recomputated we need to stop any previous
        // observeChanges.
        Tracker.onInvalidate(function () {
          ngCollection.stop();
        });

        ngCollection.updateCursor(reactiveFunc());
        ngCollection._setAutoBind();
      });

      return ngCollection;
    }

    $meteorCollection._setAutoBind = function() {
      if (!this._auto) return;

      var self = this;
      this._isAutoBind = true;

      this.unregisterAutoBind = $rootScope.$watch(function () {
        if (self.UPDATING_FROM_SERVER) {
          return 'UPDATING_FROM_SERVER';
        }
        return angular.copy(_.without(self, 'UPDATING_FROM_SERVER'));
      }, function (items, oldItems) {
        if (self._isAutoBind == false) return;
        if (items === 'UPDATING_FROM_SERVER' || oldItems === 'UPDATING_FROM_SERVER') return;
        if (items === oldItems) return;

        self._isAutoBind = false;
        self.unregisterAutoBind();
        collectionUtils.updateCollection(self, oldItems, self.diffArrayFunc);
        self._setAutoBind();
      }, true);
    };

    return $meteorCollection;
 }]);

angularMeteorCollection.run(['$rootScope', '$meteorCollection', '$meteorCollectionFS', '$meteorStopper',
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
