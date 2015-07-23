'use strict';

var angularMeteorCollections = angular.module('angular-meteor.meteor-collection',
  ['angular-meteor.subscribe', 'angular-meteor.utils', 'diffArray']);

// The reason angular meteor collection is a factory function and not something
// that inherit from array comes from here: http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/
// We went with the direct extensions approach
angularMeteorCollections.factory('AngularMeteorCollection', [
  '$q', '$meteorSubscribe', '$meteorUtils', '$rootScope', '$timeout', 'deepCopyChanges', 'deepCopyRemovals',
  function ($q, $meteorSubscribe, $meteorUtils, $rootScope, $timeout, deepCopyChanges, deepCopyRemovals) {
    var AngularMeteorCollection = {};

    AngularMeteorCollection.subscribe = function () {
      $meteorSubscribe.subscribe.apply(this, arguments);
      return this;
    };

    AngularMeteorCollection.save = function (docs, useUnsetModifier) {
      var self = this;

      /*
       * The upsertObject function will either update an object if the _id exists
       * or insert an object if the _id is not set in the collection.
       * Returns a promise.
       */
      function upsertObject(item, $q) {
        var deferred = $q.defer();

        // delete $$hashkey
        item = $meteorUtils.stripDollarPrefixedKeys(item);

        function onUpsertComplete(objectId, error, action) {
            if (error) {
              deferred.reject(error);
            } else {
              deferred.resolve({_id: objectId, action: action});
            }
        }

        var collection = self.$$collection;
        if (item._id) { // Performs an update if the _id property is set.
          var objectId = item._id;
          // Deletes the _id property so that it can be $set using update.
          delete item._id;
          var modifier = (useUnsetModifier) ? {$unset: item} : {$set: item};
          collection.update(objectId, modifier, function (error) {
            onUpsertComplete(objectId, error, 'updated');
          });
        } else { // Performs an insert if the _id property isn't set.
          collection.insert(item, function (error, objectId) {
            onUpsertComplete(objectId, error, 'inserted');
          });
        }

        return deferred.promise;
      }

      // How to update the collection depending on the 'docs' argument passed.
      var promises = [];
      if (docs) { // Checks if a 'docs' argument was passed.
        if (angular.isArray(docs)) { // If an array of objects were passed.
          angular.forEach(docs, function (doc) {
            promises.push(upsertObject(doc, $q));
          });
        } else { // If a single object was passed.
          promises.push(upsertObject(docs, $q));
        }
      } else {
        angular.forEach(self, function (doc) {
          promises.push(upsertObject(doc, $q));
        });
      }

      var allPromise = $q.all(promises);
      allPromise.finally(function() {
        $timeout(angular.noop);
      });

      return allPromise; // Returns all promises when they're resolved.
    };

    AngularMeteorCollection.remove = function remove(keyOrDocs) {
      var keys;
      if (keyOrDocs) {
        keyOrDocs = angular.isArray(keyOrDocs) ? keyOrDocs : [keyOrDocs];
        keys = _.map(keyOrDocs, function(keyOrDoc) {
          return keyOrDoc._id || keyOrDoc;
        });
      } else {
        // If keys not set - removing all.
        // Untrusted code can only remove a single document at a time, specified by its _id.
        // http://docs.meteor.com/#/full/remove.
        keys = _.map(self, function(doc) { return doc._id; });
      }

      // Check if all keys are correct.
      check(keys, [Match.OneOf(String, Mongo.ObjectID)]);

      var self = this;

      /*
       * The removeObject function will delete an object with the _id property
       * equal to the specified key.
       * Returns a promise.
       */
      function removeObject(key, $q) {
        var deferred = $q.defer();

        var collection = self.$$collection;
        collection.remove(key, function (error) {
          if (error) {
            deferred.reject(error);
          } else {
            deferred.resolve({_id: key, action: 'removed'});
          }
        });

        return deferred.promise;
      };

      // What to remove from collection depending on the 'keys' argument passed.
      var promises = [];
      angular.forEach(keys, function (key) {
        promises.push(removeObject(key, $q));
      });

      var allPromise = $q.all(promises);
      allPromise.finally(function() {
        // Applies after all changes done.
        $timeout(angular.noop);
      });

      return allPromise; // Returns all promises when they're resolved.
    };

    AngularMeteorCollection.updateCursor = function (cursor) {
      var self = this;

      // Function applies multiple operations (savings, deletions etc) once
      // with the help of $timeout.
      function safeApply(promise) {
        if (promise) {
          $timeout.cancel(promise);
        }
        // Clearing the watch is needed so no updates are sent to server
        // while handling updates from the server.
        if (!self.UPDATING_FROM_SERVER) {
          self.UPDATING_FROM_SERVER = true;
          if (!$rootScope.$$phase) $rootScope.$apply();
        }
        return $timeout(function () {
          // Saves changes happened within the previous update from server.
          updateCollection(self, self._serverBackup, self.diffArrayFunc);
          self.UPDATING_FROM_SERVER = false;
        }, 50);
      }

      // XXX - consider adding an option for a non-orderd result
      // for faster performance
      if (self.observeHandle) {
        self.observeHandle.stop();
      }

      var promise;
      self.observeHandle = cursor.observe({
        addedAt: function (document, atIndex) {
          self.splice(atIndex, 0, document);
          self._serverBackup.splice(atIndex, 0, document);
          promise = safeApply(promise);
        },
        changedAt: function (document, oldDocument, atIndex) {
          deepCopyChanges(self[atIndex], document);
          deepCopyRemovals(self[atIndex], document);
          self._serverBackup[atIndex] = self[atIndex];
          promise = safeApply(promise);
        },
        movedTo: function (document, fromIndex, toIndex) {
          self.splice(fromIndex, 1);
          self.splice(toIndex, 0, document);
          self._serverBackup.splice(fromIndex, 1);
          self._serverBackup.splice(toIndex, 0, document);
          promise = safeApply(promise);
        },
        removedAt: function (oldDocument) {
          function findRemoveInd(collection, doc1) {
            var removedObj = _.find(collection, function(doc2) {
              // EJSON.equals used to compare Mongo.ObjectIDs and Strings.
              return EJSON.equals(doc1._id, doc2._id);
            });
            return _.indexOf(collection, removedObj);
          }

          var removeInd = findRemoveInd(self, oldDocument);
          if (removeInd != -1) {
            self.splice(removeInd, 1);
            self._serverBackup.splice(removeInd, 1);
            promise = safeApply(promise);
          } else {
            // If it's been removed on client then it's already not in collection
            // itself but still is in the _serverBackup.
            removeInd = findRemoveInd(self._serverBackup, oldDocument);
            if (removeInd != -1) {
              self._serverBackup.splice(removeInd, 1);
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

      while (this.length > 0) {
        this.pop();
        this._serverBackup.pop();
      }
    };

    var createAngularMeteorCollection = function (cursor, collection, diffArrayFunc) {
      var data = [];
      data._serverBackup = [];
      data.diffArrayFunc = diffArrayFunc;
      data.$$collection = angular.isDefined(collection) ? collection :
        $meteorUtils.getCollectionByName(cursor.collection.name);

      angular.extend(data, AngularMeteorCollection);

      return data;
    };

    return createAngularMeteorCollection;
  }]);

angularMeteorCollections.factory('$meteorCollectionFS', ['$meteorCollection', 'diffArray',
  function ($meteorCollection, diffArray) {
    var noNestedDiffArray = function (lastSeqArray, seqArray, callbacks) {
      return diffArray(lastSeqArray, seqArray, callbacks, true);
    };

    return function (reactiveFunc, auto, collection) {
      return new $meteorCollection(reactiveFunc, auto, collection, noNestedDiffArray);
    };
  }]);


angularMeteorCollections.factory('$meteorCollection', [
  'AngularMeteorCollection', '$rootScope', 'diffArray',
  function (AngularMeteorCollection, $rootScope, diffArray) {
    return function (reactiveFunc, auto, collection, diffArrayFunc) {
      // Validate parameters
      if (!reactiveFunc) {
        throw new TypeError('The first argument of $meteorCollection is undefined.');
      }
      if (!(angular.isFunction(reactiveFunc) || angular.isFunction(reactiveFunc.find))) {
        throw new TypeError(
          'The first argument of $meteorCollection must be a function or a have a find function property.');
      }

      if (!(angular.isFunction(reactiveFunc))) {
        collection = angular.isDefined(collection) ? collection : reactiveFunc;
        reactiveFunc = _.bind(reactiveFunc.find, reactiveFunc);
      }

      diffArrayFunc = diffArrayFunc || diffArray;
      var ngCollection = new AngularMeteorCollection(reactiveFunc(), collection, diffArrayFunc);

      // By default auto - true;
      auto = angular.isDefined(auto) ? auto : true;
      function setAutoBind() {
        if (auto) { // Deep watches the model and performs autobind.
          ngCollection._isAutoBind = true;
          ngCollection.unregisterAutoBind = $rootScope.$watch(function () {
            if (ngCollection.UPDATING_FROM_SERVER) {
              return 'UPDATING_FROM_SERVER';
            }
            delete ngCollection.UPDATING_FROM_SERVER;
            return ngCollection;
          }, function (newItems, oldItems) {
            if (ngCollection._isAutoBind == false)
              return;
            if (newItems === 'UPDATING_FROM_SERVER' ||
              oldItems === 'UPDATING_FROM_SERVER')
              return;

            if (newItems !== oldItems) {
              ngCollection._isAutoBind = false;
              ngCollection.unregisterAutoBind();

              updateCollection(ngCollection, oldItems, diffArrayFunc);

              setAutoBind();
            }
          }, true);
        }
      }

      // Fetches the latest data from Meteor and update the data variable.
      Tracker.autorun(function () {
        // When the reactive func gets recomputated we need to stop any previous
        // observeChanges.
        Tracker.onInvalidate(function () {
          ngCollection.stop();
        });
        ngCollection.updateCursor(reactiveFunc());
        setAutoBind();
      });

      return ngCollection;
    }
  }]);

// Finds changes between two collections and saves difference into first one.
function updateCollection(newCollection, oldCollection, diffMethod) {
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
}

angularMeteorCollections.run([
  '$rootScope', '$q', '$meteorCollection', '$meteorCollectionFS', '$meteorSubscribe',
  function ($rootScope, $q, $meteorCollection, $meteorCollectionFS, $meteorSubscribe) {
    var collectionFunc = function (collectionType) {
      return function() {
        var args = _.toArray(arguments);
        var collection = collectionType.apply(this, args);
        var subscription = null;

        collection.subscribe = function () {
          var args = _.toArray(arguments);
          subscription = $meteorSubscribe._subscribe(this, $q.defer(), args);
          return collection;
        };

        this.$on('$destroy', function () {
          collection.stop();
          if (subscription)
            subscription.stop();
        });

        return collection;
      }
    };

    Object.getPrototypeOf($rootScope).$meteorCollection = collectionFunc($meteorCollection);
    Object.getPrototypeOf($rootScope).$meteorCollectionFS = collectionFunc($meteorCollectionFS);
  }]);
