'use strict';

var angularMeteorUtils = angular.module('angular-meteor.utils', []);

angularMeteorUtils.service('$meteorUtils', [
  '$q', '$timeout',
  function ($q, $timeout) {

    var self = this;

    this.autorun = function(scope, fn, ignoreDeprecation) {
      if (!ignoreDeprecation) {
        console.warn('[angular-meteor.utils.autorun] Please note that this method is deprecated since 1.3.0 and will be removed in 1.4.0! For more info: http://www.angular-meteor.com/api/1.3.1/autorun');
      }

      // wrapping around Deps.autorun
      var comp = Tracker.autorun(function(c) {
        fn(c);
        // this is run immediately for the first call
        // but after that, we need to $apply to start Angular digest
        if (!c.firstRun) $timeout(angular.noop, 0);
      });

      // stop autorun when scope is destroyed
      scope.$on('$destroy', function() {
        comp.stop();
      });

      // return autorun object so that it can be stopped manually
      return comp;
    };

    // Borrowed from angularFire
    // https://github.com/firebase/angularfire/blob/master/src/utils.js#L445-L454
    this.stripDollarPrefixedKeys = function (data) {
      if (!_.isObject(data) ||
          data instanceof Date ||
          data instanceof File ||
          EJSON.toJSONValue(data).$type === 'oid' ||
          (typeof FS === 'object' && data instanceof FS.File))
        return data;

      var out = _.isArray(data) ? [] : {};

      _.each(data, function(v,k) {
        if(typeof k !== 'string' || k.charAt(0) !== '$')
          out[k] = self.stripDollarPrefixedKeys(v);
      });

      return out;
    };

    // Returns a callback which fulfills promise
    this.fulfill = function(deferred, boundError, boundResult) {
      return function(err, result) {
        if (err)
          deferred.reject(boundError == null ? err : boundError);
        else if (typeof boundResult == "function")
          deferred.resolve(boundResult == null ? result : boundResult(result));
        else
          deferred.resolve(boundResult == null ? result : boundResult);
      };
    };

    // creates a function which invokes method with the given arguments and returns a promise
    this.promissor = function(obj, method) {
      return function() {
        var deferred = $q.defer();
        var fulfill = self.fulfill(deferred);
        var args = _.toArray(arguments).concat(fulfill);
        obj[method].apply(obj, args);
        return deferred.promise;
      };
    };

    // creates a $q.all() promise and call digestion loop on fulfillment
    this.promiseAll = function(promises) {
      var allPromise = $q.all(promises);

      allPromise.finally(function() {
        // calls digestion loop with no conflicts
        $timeout(angular.noop);
      });

      return allPromise;
    };

    this.getCollectionByName = function(string){
      return Mongo.Collection.get(string);
    };

    this.findIndexById = function(collection, doc) {
      var foundDoc = _.find(collection, function(colDoc) {
        // EJSON.equals used to compare Mongo.ObjectIDs and Strings.
        return EJSON.equals(colDoc._id, doc._id);
      });

      return _.indexOf(collection, foundDoc);
    };
  }
]);

angularMeteorUtils.run([
  '$rootScope', '$meteorUtils',
  function($rootScope, $meteorUtils) {
    Object.getPrototypeOf($rootScope).$meteorAutorun = function(fn) {
      return $meteorUtils.autorun(this, fn);
    };
}]);
