'use strict';

var angularMeteorObject = angular.module('angular-meteor.object', ['angular-meteor.utils', 'angular-meteor.subscribe', 'angular-meteor.collection', 'getUpdates', 'diffArray']);

angularMeteorObject.factory('AngularMeteorObject', [
  '$q', '$meteorSubscribe', '$meteorCollection', '$meteorUtils', 'diffArray', 'getUpdates',
  function($q, $meteorSubscribe, $meteorCollection, $meteorUtils, diffArray, getUpdates) {
    // A list of internals properties to not watch for, nor pass to the Document on update and etc.
    AngularMeteorObject.$$internalProps = [
      '$$collection', '$$options', '$$id', '$$hashkey', '$$internalProps', '$$scope',
      'save', 'reset', 'subscribe', 'stop', 'autorunComputation', 'unregisterAutoBind', 'unregisterAutoDestroy', 'getRawObject',
      '_auto', '_setAutos', '_eventEmitter', '_serverBackup'
    ];

    function AngularMeteorObject (collection, id, options){
      // Make data not be an object so we can extend it to preserve
      // Collection Helpers and the like
      var data = new function SubObject() {};
      var doc = collection.findOne(id, options);
      angular.extend(data, doc);
      angular.extend(data, AngularMeteorObject);

      data._serverBackup = doc || {};
      data.$$collection = collection;
      data.$$options = options;
      data.$$id = id || new Mongo.ObjectID();

      return data;
    }

    AngularMeteorObject.getRawObject = function () {
      return angular.copy(_.omit(this, this.$$internalProps));
    };

    AngularMeteorObject.subscribe = function () {
      $meteorSubscribe.subscribe.apply(this, arguments);
      return this;
    };

    AngularMeteorObject.save = function(custom) {
      var deferred = $q.defer();
      var collection = this.$$collection;
      var createFulfill = _.partial($meteorUtils.fulfill, deferred, null);
      var oldDoc = collection.findOne(this.$$id);
      var mods;

      // update
      if (oldDoc) {
        if (custom)
          mods = { $set: custom };
        else {
          mods = getUpdates(oldDoc, this.getRawObject());
          // If there are no updates, there is nothing to do here, returning
          if (_.isEmpty(mods)) {
            return $q.when({ action: 'updated' });
          }
        }

        var pullUpdate;
        if (mods.$pull) {
          pullUpdate = { $pull : mods.$pull };
        }

        if (!pullUpdate) {
          // NOTE: do not use #upsert() method, since it does not exist in some collections
          collection.update(this.$$id, mods, createFulfill({action: 'updated'}));
        }
        else {
          collection.update(this.$$id, mods);
          collection.update(this.$$id, pullUpdate, createFulfill({action: 'updated'}))
        }
      }
      // insert
      else {
        if (custom)
          mods = _.clone(custom);
        else
          mods = this.getRawObject();

        mods._id = this.$$id;
        collection.insert(mods, createFulfill({ action: 'inserted' }));
      }

      return deferred.promise;
    };

    AngularMeteorObject.reset = function(keepClientProps) {
      var self = this;
      var options = this.$$options;
      var id = this.$$id;
      var doc = this.$$collection.findOne(id, options);

      if (doc) {
        // extend SubObject
        var docKeys = _.keys(doc);
        var docExtension = _.pick(doc, docKeys);
        var clientProps;

        angular.extend(Object.getPrototypeOf(self), Object.getPrototypeOf(doc));
        _.extend(self, docExtension);
        _.extend(self._serverBackup, docExtension);

        if (keepClientProps) {
          clientProps = _.intersection(_.keys(self), _.keys(self._serverBackup));
        } else {
          clientProps = _.keys(self);
        }

        var serverProps = _.keys(doc);
        var removedKeys = _.difference(clientProps, serverProps, self.$$internalProps);

        removedKeys.forEach(function (prop) {
          delete self[prop];
          delete self._serverBackup[prop];
        });
      }

      else {
        _.keys(this.getRawObject()).forEach(function(prop) {
          delete self[prop];
        });

        self._serverBackup = {};
      }
    };

    AngularMeteorObject.stop = function () {
      if (this.unregisterAutoDestroy)
        this.unregisterAutoDestroy();

      if (this.unregisterAutoBind)
        this.unregisterAutoBind();

      if (this.autorunComputation && this.autorunComputation.stop)
        this.autorunComputation.stop();
    };

    return AngularMeteorObject;
}]);


angularMeteorObject.factory('$meteorObject', [
  '$rootScope', '$meteorUtils', 'getUpdates', 'AngularMeteorObject',
  function($rootScope, $meteorUtils, getUpdates, AngularMeteorObject) {
    function $meteorObject(collection, id, auto, options) {
      // Validate parameters
      if (!collection) {
        throw new TypeError("The first argument of $meteorObject is undefined.");
      }

      if (!angular.isFunction(collection.findOne)) {
        throw new TypeError("The first argument of $meteorObject must be a function or a have a findOne function property.");
      }

      var data = new AngularMeteorObject(collection, id, options);
      data._auto = auto !== false; // Making auto default true - http://stackoverflow.com/a/15464208/1426570
      angular.extend(data, $meteorObject);
      data._setAutos();
      return data;
    }

    $meteorObject._setAutos = function() {
      var self = this;

      this.autorunComputation = $meteorUtils.autorun($rootScope, function() {
        self.reset(true);
      });

      // Deep watches the model and performs autobind
      this.unregisterAutoBind = this._auto && $rootScope.$watch(function(){
        return self.getRawObject();
      }, function (item, oldItem) {
        if (item === oldItem) {
          self.$$collection.update({_id: item._id}, self.getRawObject());
          return;
        }

        var id = item._id;
        delete item._id;
        delete oldItem._id;

        var updates = getUpdates(oldItem, item);
        if (_.isEmpty(updates)) return;
        var pullUpdate;

        if (updates.$pull) {
          pullUpdate = { $pull : updates.$pull };
          delete updates.$pull;
        }
        self.$$collection.update({_id: id}, updates);

        if (pullUpdate) {
          self.$$collection.update({ _id : id}, pullUpdate);
        }
      }, true);

      this.unregisterAutoDestroy = $rootScope.$on('$destroy', function() {
        if (self && self.stop) {
          self.stop();
        }
      });
    };

    return $meteorObject;
}]);

angularMeteorObject.run([
  '$rootScope', '$meteorObject', '$meteorStopper',
  function ($rootScope, $meteorObject, $meteorStopper) {
    var scopeProto = Object.getPrototypeOf($rootScope);
    scopeProto.$meteorObject = $meteorStopper($meteorObject);
}]);
