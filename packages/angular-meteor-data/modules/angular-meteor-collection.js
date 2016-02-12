/*global
 angular, _, Tracker, check, Match, Mongo
 */

'use strict';

var angularMeteorCollection = angular.module('angular-meteor.collection',
  ['angular-meteor.stopper', 'angular-meteor.subscribe', 'angular-meteor.utils', 'diffArray']);

// The reason angular meteor collection is a factory function and not something
// that inherit from array comes from here:
// http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/
// We went with the direct extensions approach.
angularMeteorCollection.factory('AngularMeteorCollection', [
  '$q', '$meteorSubscribe', '$meteorUtils', '$rootScope', '$timeout', 'diffArray', '$angularMeteorSettings',
  function($q, $meteorSubscribe, $meteorUtils, $rootScope, $timeout, diffArray, $angularMeteorSettings) {

    function AngularMeteorCollection(curDefFunc, collection, diffArrayFunc, autoClientSave) {
      if (!$angularMeteorSettings.suppressWarnings)
        console.warn('[angular-meteor.$meteorCollection] Please note that this method is deprecated since 1.3.0 and will be removed in 1.4.0! For more info: http://www.angular-meteor.com/api/1.3.0/meteorCollection. You can disable this warning by following this guide http://www.angular-meteor.com/api/1.3.6/settings');

      var data = [];
      // Server backup data to evaluate what changes come from client
      // after each server update.
      data._serverBackup = [];
      // Array differ function.
      data._diffArrayFunc = diffArrayFunc;
      // Handler of the cursor observer.
      data._hObserve = null;
      // On new cursor autorun handler
      // (autorun for reactive variables).
      data._hNewCurAutorun = null;
      // On new data autorun handler
      // (autorun for cursor.fetch).
      data._hDataAutorun = null;

      if (angular.isDefined(collection)) {
        data.$$collection = collection;
      } else {
        var cursor = curDefFunc();
        data.$$collection = $meteorUtils.getCollectionByName(cursor.collection.name);
      }

      _.extend(data, AngularMeteorCollection);
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

        if (autoClientSave) self._setAutoClientSave();
        self._updateCursor(curDefFunc(), autoClientSave);
      });
    };

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

      return $meteorUtils.promiseAll(promises);
    };

    AngularMeteorCollection._upsertDoc = function(doc, useUnsetModifier) {
      var deferred = $q.defer();
      var collection = this.$$collection;
      var createFulfill = _.partial($meteorUtils.fulfill, deferred, null);

      // delete $$hashkey
      doc = $meteorUtils.stripDollarPrefixedKeys(doc);
      var docId = doc._id;
      var isExist = collection.findOne(docId);

      // update
      if (isExist) {
        // Deletes _id property (from the copy) so that
        // it can be $set using update.
        delete doc._id;
        var modifier = useUnsetModifier ? {$unset: doc} : {$set: doc};
        // NOTE: do not use #upsert() method, since it does not exist in some collections
        collection.update(docId, modifier, createFulfill(function() {
          return {_id: docId, action: 'updated'};
        }));
      }
      // insert
      else {
        collection.insert(doc, createFulfill(function(id) {
          return {_id: id, action: 'inserted'};
        }));
      }

      return deferred.promise;
    };

    // performs $pull operations parallely.
    // used for handling splice operations returned from getUpdates() to prevent conflicts.
    // see issue: https://github.com/Urigo/angular-meteor/issues/793
    AngularMeteorCollection._updateDiff = function(selector, update, callback) {
      callback = callback || angular.noop;
      var setters = _.omit(update, '$pull');
      var updates = [setters];

      _.each(update.$pull, function(pull, prop) {
        var puller = {};
        puller[prop] = pull;
        updates.push({ $pull: puller });
      });

      this._updateParallel(selector, updates, callback);
    };

    // performs each update operation parallely
    AngularMeteorCollection._updateParallel = function(selector, updates, callback) {
      var self = this;
      var done = _.after(updates.length, callback);

      var next = function(err, affectedDocsNum) {
        if (err) return callback(err);
        done(null, affectedDocsNum);
      };

      _.each(updates, function(update) {
        self.$$collection.update(selector, update, next);
      });
    };

    AngularMeteorCollection.remove = function(keyOrDocs) {
      var keys;

      // remove whole collection
      if (!keyOrDocs) {
        keys = _.pluck(this, '_id');
      }
      // remove docs
      else {
        keyOrDocs = [].concat(keyOrDocs);

        keys = _.map(keyOrDocs, function(keyOrDoc) {
          return keyOrDoc._id || keyOrDoc;
        });
      }

      // Checks if all keys are correct.
      check(keys, [Match.OneOf(String, Mongo.ObjectID)]);

      var promises = keys.map(function(key) {
        return this._removeDoc(key);
      }, this);

      return $meteorUtils.promiseAll(promises);
    };

    AngularMeteorCollection._removeDoc = function(id) {
      var deferred = $q.defer();
      var collection = this.$$collection;
      var fulfill = $meteorUtils.fulfill(deferred, null, { _id: id, action: 'removed' });
      collection.remove(id, fulfill);
      return deferred.promise;
    };

    AngularMeteorCollection._updateCursor = function(cursor, autoClientSave) {
      var self = this;
      // XXX - consider adding an option for a non-orderd result for faster performance
      if (self._hObserve) self._stopObserving();


      self._hObserve = cursor.observe({
        addedAt: function(doc, atIndex) {
          self.splice(atIndex, 0, doc);
          self._serverBackup.splice(atIndex, 0, doc);
          self._setServerUpdateMode();
        },

        changedAt: function(doc, oldDoc, atIndex) {
          diffArray.deepCopyChanges(self[atIndex], doc);
          diffArray.deepCopyRemovals(self[atIndex], doc);
          self._serverBackup[atIndex] = self[atIndex];
          self._setServerUpdateMode();
        },

        movedTo: function(doc, fromIndex, toIndex) {
          self.splice(fromIndex, 1);
          self.splice(toIndex, 0, doc);
          self._serverBackup.splice(fromIndex, 1);
          self._serverBackup.splice(toIndex, 0, doc);
          self._setServerUpdateMode();
        },

        removedAt: function(oldDoc) {
          var removedIndex = $meteorUtils.findIndexById(self, oldDoc);

          if (removedIndex != -1) {
            self.splice(removedIndex, 1);
            self._serverBackup.splice(removedIndex, 1);
            self._setServerUpdateMode();
          } else {
            // If it's been removed on client then it's already not in collection
            // itself but still is in the _serverBackup.
            removedIndex = $meteorUtils.findIndexById(self._serverBackup, oldDoc);

            if (removedIndex != -1) {
              self._serverBackup.splice(removedIndex, 1);
            }
          }
        }
      });

      self._hDataAutorun = Tracker.autorun(function() {
        cursor.fetch();
        if (self._serverMode) self._unsetServerUpdateMode(autoClientSave);
      });
    };

    AngularMeteorCollection._stopObserving = function() {
      this._hObserve.stop();
      this._hDataAutorun.stop();
      delete this._serverMode;
      delete this._hUnsetTimeout;
    };

    AngularMeteorCollection._setServerUpdateMode = function(name) {
      this._serverMode = true;
      // To simplify server update logic, we don't follow
      // updates from the client at the same time.
      this._unsetAutoClientSave();
    };

    // Here we use $timeout to combine multiple updates that go
    // each one after another.
    AngularMeteorCollection._unsetServerUpdateMode = function(autoClientSave) {
      var self = this;

      if (self._hUnsetTimeout) {
        $timeout.cancel(self._hUnsetTimeout);
        self._hUnsetTimeout = null;
      }

      self._hUnsetTimeout = $timeout(function() {
        self._serverMode = false;
        // Finds updates that was potentially done from the client side
        // and saves them.
        var changes = diffArray.getChanges(self, self._serverBackup, self._diffArrayFunc);
        self._saveChanges(changes);
        // After, continues following client updates.
        if (autoClientSave) self._setAutoClientSave();
      }, 0);
    };

    AngularMeteorCollection.stop = function() {
      this._stopCursor();
      this._hNewCurAutorun.stop();
    };

    AngularMeteorCollection._stopCursor = function() {
      this._unsetAutoClientSave();

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
      }, function(nItems, oItems) {
        if (nItems === oItems) return;

        var changes = diffArray.getChanges(self, oItems, self._diffArrayFunc);
        self._unsetAutoClientSave();
        self._saveChanges(changes);
        self._setAutoClientSave();
      }, true);
    };

    AngularMeteorCollection._saveChanges = function(changes) {
      var self = this;

      // Saves added documents
      // Using reversed iteration to prevent indexes from changing during splice
      var addedDocs = changes.added.reverse().map(function(descriptor) {
        self.splice(descriptor.index, 1);
        return descriptor.item;
      });

      if (addedDocs.length) self.save(addedDocs);

      // Removes deleted documents
      var removedDocs = changes.removed.map(function(descriptor) {
        return descriptor.item;
      });

      if (removedDocs.length) self.remove(removedDocs);

      // Updates changed documents
      changes.changed.forEach(function(descriptor) {
        self._updateDiff(descriptor.selector, descriptor.modifier);
      });
    };

    return AngularMeteorCollection;
}]);

angularMeteorCollection.factory('$meteorCollectionFS', [
  '$meteorCollection', 'diffArray', '$angularMeteorSettings',
  function($meteorCollection, diffArray, $angularMeteorSettings) {
    function $meteorCollectionFS(reactiveFunc, autoClientSave, collection) {

      if (!$angularMeteorSettings.suppressWarnings)
        console.warn('[angular-meteor.$meteorCollectionFS] Please note that this method is deprecated since 1.3.0 and will be removed in 1.4.0! For more info: http://www.angular-meteor.com/api/1.3.0/files. You can disable this warning by following this guide http://www.angular-meteor.com/api/1.3.6/settings');
      return new $meteorCollection(reactiveFunc, autoClientSave, collection, diffArray.shallow);
    }

    return $meteorCollectionFS;
}]);

angularMeteorCollection.factory('$meteorCollection', [
  'AngularMeteorCollection', '$rootScope', 'diffArray',
  function(AngularMeteorCollection, $rootScope, diffArray) {
    function $meteorCollection(reactiveFunc, autoClientSave, collection, diffFn) {
      // Validate parameters
      if (!reactiveFunc) {
        throw new TypeError('The first argument of $meteorCollection is undefined.');
      }

      if (!(angular.isFunction(reactiveFunc) || angular.isFunction(reactiveFunc.find))) {
        throw new TypeError(
          'The first argument of $meteorCollection must be a function or ' +
            'a have a find function property.');
      }

      if (!angular.isFunction(reactiveFunc)) {
        collection = angular.isDefined(collection) ? collection : reactiveFunc;
        reactiveFunc = _.bind(reactiveFunc.find, reactiveFunc);
      }

      // By default auto save - true.
      autoClientSave = angular.isDefined(autoClientSave) ? autoClientSave : true;
      diffFn = diffFn || diffArray;
      return new AngularMeteorCollection(reactiveFunc, collection, diffFn, autoClientSave);
    }

    return $meteorCollection;
}]);

angularMeteorCollection.run([
  '$rootScope', '$meteorCollection', '$meteorCollectionFS', '$meteorStopper',
  function($rootScope, $meteorCollection, $meteorCollectionFS, $meteorStopper) {
    var scopeProto = Object.getPrototypeOf($rootScope);
    scopeProto.$meteorCollection = $meteorStopper($meteorCollection);
    scopeProto.$meteorCollectionFS = $meteorStopper($meteorCollectionFS);
}]);
