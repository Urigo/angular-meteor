'use strict';
var angularMeteorUtils = angular.module('angular-meteor.utils', []);

angularMeteorUtils.service('$meteorUtils', [ '$timeout',
  function ($timeout) {
    var self = this;
    this.getCollectionByName = function(string){
      return Mongo.Collection.get(string);
    };
    this.autorun = function(scope, fn) {
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
    // Borrowed from angularFire - https://github.com/firebase/angularfire/blob/master/src/utils.js#L445-L454
    this.stripDollarPrefixedKeys = function (data) {
      if( !angular.isObject(data) ||
        data instanceof Date ||
        data instanceof File ||
        (typeof FS === 'object' && data instanceof FS.File)) {
        return data;
      }
      var out = angular.isArray(data)? [] : {};
      angular.forEach(data, function(v,k) {
        if(typeof k !== 'string' || k.charAt(0) !== '$') {
          out[k] = self.stripDollarPrefixedKeys(v);
        }
      });
      return out;
    };
  }]);

angularMeteorUtils.run(['$rootScope', '$meteorUtils',
  function($rootScope, $meteorUtils) {
    Object.getPrototypeOf($rootScope).$meteorAutorun = function(fn) {
      return $meteorUtils.autorun(this, fn);
    };
}]);
