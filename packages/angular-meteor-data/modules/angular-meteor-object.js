'use strict';

var angularMeteorObject = angular.module('angular-meteor.object',
  ['angular-meteor.utils', 'angular-meteor.subscribe', 'angular-meteor.collection', 'getUpdates', 'diffArray']);

angularMeteorObject.factory('AngularMeteorObject', [
  '$q', '$meteorSubscribe', '$meteorUtils', 'diffArray', 'getUpdates', 'AngularMeteorCollection',
  function($q, $meteorSubscribe, $meteorUtils, diffArray, getUpdates, AngularMeteorCollection) {

    // A list of internals properties to not watch for, nor pass to the Document on update and etc.
    AngularMeteorObject.$$internalProps = [
      '$$collection', '$$options', '$$id', '$$hashkey', '$$internalProps', '$$scope',
      'bind', 'save', 'reset', 'subscribe', 'stop', 'autorunComputation', 'unregisterAutoBind', 'unregisterAutoDestroy', 'getRawObject',
      '_auto', '_setAutos', '_eventEmitter', '_serverBackup', '_updateDiff', '_updateParallel', '_getId'
    ];

    function AngularMeteorObject (collection, selector, options){
      console.warn('[angular-meteor.$meteorObject] Please note that this method is deprecated since 1.3.0 and will be removed in 1.4.0! For more info: http://www.angular-meteor.com/api/1.3.0/meteorObject');
      // Make data not be an object so we can extend it to preserve
      // Collection Helpers and the like
      var helpers = collection._helpers;
      var data = _.isFunction(helpers) ? Object.create(helpers.prototype) : {};
      var doc = collection.findOne(selector, options);
      var collectionExtension = _.pick(AngularMeteorCollection, '_updateParallel');
      _.extend(data, doc);
      _.extend(data, AngularMeteorObject);
      _.extend(data, collectionExtension);

      // Omit options that may spoil document finding
      data.$$options = _.omit(options, 'skip', 'limit');
      data.$$collection = collection;
      data.$$id = data._getId(selector);
      data._serverBackup = doc || {};

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

        // NOTE: do not use #upsert() method, since it does not exist in some collections
        this._updateDiff(mods, createFulfill({ action: 'updated' }));
      }
      // insert
      else {
        if (custom)
          mods = _.clone(custom);
        else
          mods = this.getRawObject();

        mods._id = mods._id || this.$$id;
        collection.insert(mods, createFulfill({ action: 'inserted' }));
      }

      return deferred.promise;
    };

    AngularMeteorObject._updateDiff = function(update, callback) {
      var selector = this.$$id;
      AngularMeteorCollection._updateDiff.call(this, selector, update, callback);
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

    AngularMeteorObject._getId = function(selector) {
      var options = _.extend({}, this.$$options, {
        fields: { _id: 1 },
        reactive: false,
        transform: null
      });

      var doc = this.$$collection.findOne(selector, options);

      if (doc) return doc._id;
      if (selector instanceof Mongo.ObjectID) return selector;
      if (_.isString(selector)) return selector;
      return new Mongo.ObjectID();
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
      // Making auto default true - http://stackoverflow.com/a/15464208/1426570
      data._auto = auto !== false;
      _.extend(data, $meteorObject);
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
        if (item !== oldItem) self.save();
      }, true);

      this.unregisterAutoDestroy = $rootScope.$on('$destroy', function() {
        if (self && self.stop) self.pop();
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
