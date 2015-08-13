'use strict';

var angularMeteorCollection = angular.module('angular-meteor.collection',
  ['angular-meteor.stopper', 'angular-meteor.subscribe', 'angular-meteor.utils', 'diffArray']);

// The reason angular meteor collection is a factory function and not something
// that inherit from array comes from here:
// http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/
// We went with the direct extensions approach
angularMeteorCollection.factory('AngularMeteorCollection', [
  '$q', '$meteorSubscribe', '$meteorUtils', '$rootScope', '$timeout', 'diffArray',
  function($q, $meteorSubscribe, $meteorUtils, $rootScope, $timeout, diffArray) {
    var deepCopyChanges = diffArray.deepCopyChanges;
    var deepCopyRemovals = diffArray.deepCopyRemovals;

    function AngularMeteorCollection(curDefFunc, collection, diffArrayFunc, autoClientSave) {
      var data = [];
      data._serverBackup = [];
      data._diffArrayFunc = diffArrayFunc;
      data._hObserve = null;
      data._hNewCurAutorun = null;
      data._hDataAutorun = null;

      if (angular.isDefined(collection)) {
        data.$$collection = collection;
      } else {
        var cursor = curDefFunc();
        data.$$collection = $meteorUtils.getCollectionByName(cursor.collection.name);
      }

      angular.extend(data, AngularMeteorCollection);
      data._startCurAutorun(curDefFunc, autoClientSave);

      return data;
    }

    AngularMeteorCollection._startCurAutorun = function(curDefFunc, autoClientSave) {
      var self = this;
      self._hNewCurAutorun = Tracker.autorun(function() {
        // When the reactive func gets recomputated we need to stop any previous
        // observeChanges.
        Tracker.onInvalidate(function() {
          self._stopCursor();
        });
        if (autoClientSave) {
          self._setAutoClientSave();
        }
        self._updateCursor(curDefFunc(), autoClientSave);
      });
    }

    AngularMeteorCollection.subscribe = function() {
      $meteorSubscribe.subscribe.apply(this, arguments);
      return this;
    };

    AngularMeteorCollection.save = function(docs, useUnsetModifier) {
      // save whole collection
      if (!docs) docs = this;
      // save single doc
      docs = [].concat(docs);

      var promises = docs.map(function(doc) {
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
        if (error) {
          deferred.reject(error);
          return;
        }
        deferred.resolve({_id: docId, action: action});
      }

      // update
      var docId = doc._id;
      if (docId) {
        // Deletes _id property (from the copy) so that
        // it can be $set using update.
        delete doc._id;
        var modifier = useUnsetModifier ? {$unset: doc} : {$set: doc};
        collection.update(docId, modifier, function(error) {
          onComplete(docId, error, 'updated');
        });
      } else {
        // insert
        collection.insert(doc, function(error, docId) {
          onComplete(docId, error, 'inserted');
        });
      }

      return deferred.promise;
    };

    AngularMeteorCollection.remove = function(keyOrDocs) {
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

      var promises = keys.map(function(key) {
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
        if (err) {
          deffered.reject(err);
          return;
        }
        deffered.resolve({_id: id, action: 'removed'});
      });

      return deffered.promise;
    };

    AngularMeteorCollection._updateCursor = function(cursor, autoClientSave) {
      var self = this;

      // XXX - consider adding an option for a non-orderd result
      // for faster performance.
      if (self._hObserve) {
        self._hObserve.stop();
        self._hDataAutorun.stop();
      }

      var serverMode = false;
      function setServerUpdateMode(name) {
        serverMode = true;
        // To simplify server update logic, we don't follow 
        // updates from the client at the same time.
        self._unsetAutoClientSave();
      }

      var hUnsetTimeout = null;
      // Here we use $timeout to combine multiple updates that go
      // one after another.
      function unsetServerUpdateMode() {
        if (hUnsetTimeout) {
          $timeout.cancel(hUnsetTimeout);
          hUnsetTimeout = null;
        }
        hUnsetTimeout = $timeout(function() {
          serverMode = false;
          // Finds updates that was potentially done from the client side
          // and saves them.
          var changes = collectionUtils.diff(self, self._serverBackup,
            self._diffArrayFunc);
          self._saveChanges(changes);
          // After, continues following client updates.
          if (autoClientSave) {
            self._setAutoClientSave();
          }
        }, 0);
      }

      this._hObserve = cursor.observe({
        addedAt: function(doc, atIndex) {
          self.splice(atIndex, 0, doc);
          self._serverBackup.splice(atIndex, 0, doc);
          setServerUpdateMode();
        },

        changedAt: function(doc, oldDoc, atIndex) {
          deepCopyChanges(self[atIndex], doc);
          deepCopyRemovals(self[atIndex], doc);
          self._serverBackup[atIndex] = self[atIndex];
          setServerUpdateMode();
        },

        movedTo: function(doc, fromIndex, toIndex) {
          self.splice(fromIndex, 1);
          self.splice(toIndex, 0, doc);
          self._serverBackup.splice(fromIndex, 1);
          self._serverBackup.splice(i, 0, doc);
          setServerUpdateMode();
        },

        removedAt: function(oldDoc) {
          var removedIndex = collectionUtils.findIndexById(self, oldDoc);

          if (removedIndex != -1) {
            self.splice(removedIndex, 1);
            self._serverBackup.splice(removedIndex, 1);
            setServerUpdateMode();
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
  
      var hTimeout = null;
      this._hDataAutorun = Tracker.autorun(function() {
        cursor.fetch();
        if (serverMode) {
          unsetServerUpdateMode();
        }
      });
    };

    AngularMeteorCollection.stop = function() {
      this._stopCursor();
      this._hNewCurAutorun.stop();
    };

    AngularMeteorCollection._stopCursor = function() {
      if (this._unsetAutoClientSave) {
        this._unsetAutoClientSave();
      }

      if (this._hObserve) {
        this._hObserve.stop();
        this._hDataAutorun.stop();
      }

      this.splice(0);
      this._serverBackup.splice(0);
    };

    AngularMeteorCollection._unsetAutoClientSave = function(name) {
      if (this._hRegAutoBind) {
        this._hRegAutoBind();
        this._hRegAutoBind = null;
      }
    };

    AngularMeteorCollection._setAutoClientSave = function() {
      var self = this;

      // Always unsets auto save to keep only one $watch handler. 
      self._unsetAutoClientSave();

      self._hRegAutoBind = $rootScope.$watch(function() {
        return self;
      }, function (nItems, oItems) {
        if (nItems === oItems) return;

        self._unsetAutoClientSave();
        var changes = collectionUtils.diff(self, oItems,
          self._diffArrayFunc);
        self._saveChanges(changes);
        self._setAutoClientSave();
      }, true);
    };

    AngularMeteorCollection._saveChanges = function(changes) {
      // First applies changes to the collection itself.
      for (var itemInd = changes.added.length - 1; itemInd >= 0; itemInd--) {
        this.splice(changes.added[itemInd].index, 1);
      }

      // Then saves additions.
      for (var itemInd = 0; itemInd < changes.added.length; itemInd++) {
        this.save(changes.added[itemInd].item);
      }

      // Then saves removes.
      for (var itemInd = 0; itemInd < changes.removed.length; itemInd++) {
        this.remove(changes.removed[itemInd].item);
      }

      // Then saves changes.
      for (var itemInd = 0; itemInd < changes.changed.length; itemInd++) {
        var change = changes.changed[itemInd];
        if (change.setDiff) {
          this.save(change.setDiff);
        }
        if (change.unsetDiff) {
          this.save(change.unsetDiff, true);
        }
      }
    };

    return AngularMeteorCollection;
}]);

angularMeteorCollection.factory('$meteorCollectionFS', ['$meteorCollection', 'diffArray',
  function($meteorCollection, diffArray) {
    function $meteorCollectionFS(reactiveFunc, autoClientSave, collection) {
      var noNestedDiffArray = function(lastSeqArray, seqArray, callbacks) {
        return diffArray(lastSeqArray, seqArray, callbacks, true);
      };

      return new $meteorCollection(reactiveFunc, autoClientSave,
        collection, noNestedDiffArray);
    }

    return $meteorCollectionFS;
}]);

angularMeteorCollection.factory('$meteorCollection', [
  'AngularMeteorCollection', '$rootScope', 'diffArray',
  function(AngularMeteorCollection, $rootScope, diffArray) {
    function $meteorCollection(reactiveFunc, autoClientSave, collection, diffArrayFunc) {
      // Validate parameters
      if (!reactiveFunc) {
        throw new TypeError('The first argument of $meteorCollection is undefined.');
      }

      if (!(angular.isFunction(reactiveFunc) || angular.isFunction(reactiveFunc.find))) {
        throw new TypeError(
          'The first argument of $meteorCollection must be a function or\
            a have a find function property.');
      }

      if (!angular.isFunction(reactiveFunc)) {
        collection = angular.isDefined(collection) ? collection : reactiveFunc;
        reactiveFunc = _.bind(reactiveFunc.find, reactiveFunc);
      }

      // By default auto save - true.
      autoClientSave = angular.isDefined(autoClientSave) ? autoClientSave : true;
      var ngCollection = new AngularMeteorCollection(reactiveFunc, collection,
        diffArrayFunc || diffArray, autoClientSave);

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
var collectionUtils = {

  findIndexById: function(collection, doc) {
    var foundDoc = _.find(collection, function(colDoc) {
      // EJSON.equals used to compare Mongo.ObjectIDs and Strings.
      return EJSON.equals(colDoc._id, doc._id);
    });
    return _.indexOf(collection, foundDoc);
  },

  // Finds changes between two collections and saves differences.
  diff: function(newCollection, oldCollection, diffMethod) {
    var changes = {added: [], removed: [], changed: []};
    diffMethod(oldCollection, newCollection, {
      addedAt: function(id, item, index) {
        changes.added.push({item: item, index: index});
      },

      removedAt: function(id, item, index) {
        changes.removed.push({item: item, index: index});
      },

      changedAt: function(id, setDiff, unsetDiff, index, oldItem) {
        changes.changed.push({setDiff: setDiff, unsetDiff: unsetDiff});
      },

      movedTo: function(id, item, fromIndex, toIndex) {
        // XXX do we need this?
      }
    });

    return changes;
  }
};
