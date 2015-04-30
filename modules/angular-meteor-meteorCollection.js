'use strict';

var angularMeteorCollections = angular.module('angular-meteor.meteor-collection',
  ['angular-meteor.subscribe', 'angular-meteor.utils', 'diffArray']);

// The reason angular meteor collection is a factory function and not something
// that inherit from array comes from here: http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/
// We went with the direct extensions approach
angularMeteorCollections.factory('AngularMeteorCollection', ['$q', '$meteorSubscribe', '$meteorUtils', '$rootScope', '$timeout',
  function($q, $meteorSubscribe, $meteorUtils, $rootScope, $timeout) {
    var AngularMeteorCollection = {};

    AngularMeteorCollection.subscribe = function () {
      $meteorSubscribe.subscribe.apply(this, arguments);
      return this;
    };

    AngularMeteorCollection.save = function save(docs, useUnsetModifier) {
      var self = this,
        collection = self.$$collection,
        promises = []; // To store all promises.

      /*
       * The upsertObject function will either update an object if the _id exists
       * or insert an object if the _id is not set in the collection.
       * Returns a promise.
       */
      function upsertObject(item, $q) {
        var deferred = $q.defer();

        // delete $$hashkey two levels down
        if (item.$$hashKey)
          delete item.$$hashKey;

        angular.forEach(item, function(prop) {
          if (prop.$$hashKey)
            delete prop.$$hashKey;
        });

        if (item._id) { // Performs an update if the _id property is set.
          var item_id = item._id; // Store the _id in temporary variable
          delete item._id; // Remove the _id property so that it can be $set using update.
          var objectId = (item_id._str) ? new Meteor.Collection.ObjectID(item_id._str) : item_id;
          var modifier = (useUnsetModifier) ? {$unset: item} : {$set: item};

          collection.update(objectId, modifier, function (error) {
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

    AngularMeteorCollection.remove = function remove(keys) {
      var self = this,
        collection = self.$$collection,
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
        // When removing all, we do not use collection.remove({}) because Meteor doesn't give the client side that permissions
        // http://stackoverflow.com/a/15465286/1426570
        var originalSelf = angular.copy(self);
        angular.forEach(originalSelf, function (doc) {
          this.push(removeObject(doc._id, $q));
        }, promises);
      }

      return $q.all(promises); // Returns all promises when they're resolved.
    };

    AngularMeteorCollection.updateCursor = function (cursor) {
      var self = this;

      function safeApply() {
        // Clearing the watch is needed so no updates are sent to server
        // while handling updates from the server
        self.UPDATING_FROM_SERVER = true;
        if (!$rootScope.$$phase) $rootScope.$apply();
        // Making sure we are setting to false only after one digest cycle and not before
        $timeout(function(){
          self.UPDATING_FROM_SERVER = false;
        },0,false);
      }

      // XXX - consider adding an option for a non-orderd result
      // for faster performance
      if (self.observeHandle) {
        self.observeHandle.stop();
      }

      self.observeHandle = cursor.observe({
        addedAt: function (document, atIndex) {
          self.splice(atIndex, 0, document);
          safeApply();
        },
        changedAt: function (document, oldDocument, atIndex) {
          self.splice(atIndex, 1, document);
          safeApply();
        },
        movedTo: function (document, fromIndex, toIndex) {
          self.splice(fromIndex, 1);
          self.splice(toIndex, 0, document);
          safeApply();
        },
        removedAt: function (oldDocument) {
          var removedObject;
          if (oldDocument._id._str){
            removedObject = _.find(self, function(obj) {
              return obj._id._str == oldDocument._id._str;
            });
          }
          else
            removedObject = _.findWhere(self, {_id: oldDocument._id});

          if (removedObject){
            self.splice(self.indexOf(removedObject), 1);
            safeApply();
          }
        }
      });
    };

    AngularMeteorCollection.stop = function () {
      if (this.unregisterAutoBind)
        this.unregisterAutoBind();

      if (this.observeHandle)
        this.observeHandle.stop();

      while (this.length > 0) {
        this.pop();
      }
    };

    var createAngularMeteorCollection = function (cursor, collection) {
      var data = [];

      data.$$collection = angular.isDefined(collection) ? collection : $meteorUtils.getCollectionByName(cursor.collection.name);

      angular.extend(data, AngularMeteorCollection);

      return data;
    };

    return createAngularMeteorCollection;
}]);


angularMeteorCollections.factory('$meteorCollection', ['AngularMeteorCollection', '$rootScope', 'diffArray',
  function (AngularMeteorCollection, $rootScope, diffArray) {
    return function (reactiveFunc, auto, collection) {
      // Validate parameters
      if (!reactiveFunc) {
        throw new TypeError("The first argument of $meteorCollection is undefined.");
      }
      if (!(typeof reactiveFunc == "function" || angular.isFunction(reactiveFunc.find))) {
        throw new TypeError("The first argument of $meteorCollection must be a function or a have a find function property.");
      }
      auto = auto !== false;

      if (!(typeof reactiveFunc == "function")) {
        var cursorFunc = reactiveFunc.find;
        collection = angular.isDefined(collection) ? collection : reactiveFunc;
        var originalCollection = reactiveFunc;
        reactiveFunc = function() {
          return cursorFunc.apply(originalCollection, [{}]);
        }
      }

      var ngCollection = new AngularMeteorCollection(reactiveFunc(), collection);
      var realOldItems;

      function setAutoBind() {
        if (auto) { // Deep watches the model and performs autobind.
          ngCollection.unregisterAutoBind = $rootScope.$watch(function () {
            if (ngCollection.UPDATING_FROM_SERVER){
              realOldItems = _.without(ngCollection, 'UPDATING_FROM_SERVER');
              return 'UPDATING_FROM_SERVER';
            }
            return _.without(ngCollection, 'UPDATING_FROM_SERVER');
          }, function (newItems, oldItems) {
            if (newItems == 'UPDATING_FROM_SERVER')
              return;

            if (oldItems == 'UPDATING_FROM_SERVER')
              oldItems = realOldItems;


            if (newItems !== oldItems) {

              diffArray(oldItems, newItems, {
                addedAt: function (id, item, index) {
                  ngCollection.unregisterAutoBind();
                  var newValue = ngCollection.splice( index, 1 )[0];
                  setAutoBind();
                  ngCollection.save(newValue);
                },
                removedAt: function (id, item, index) {
                  ngCollection.remove(id);
                },
                changedAt: function (id, setDiff, unsetDiff, index, oldItem) {

                  if (setDiff)
                    ngCollection.save(setDiff);

                  if (unsetDiff)
                    ngCollection.save(unsetDiff, true);
                },
                movedTo: function (id, item, fromIndex, toIndex) {
                  // XXX do we need this?
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
