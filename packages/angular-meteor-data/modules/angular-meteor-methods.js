'use strict';

var angularMeteorMethods = angular.module('angular-meteor.methods', ['angular-meteor.utils']);

angularMeteorMethods.service('$meteorMethods', [
  '$q', '$meteorUtils',
  function($q, $meteorUtils) {
    this.call = function(){
      console.warn('[angular-meteor.$meteor.call] Please note that this method is deprecated since 1.3.0 and will be removed in 1.4.0! http://info.meteor.com/blog/angular-meteor-1.3');

      var deferred = $q.defer();
      var fulfill = $meteorUtils.fulfill(deferred);
      var args = _.toArray(arguments).concat(fulfill);
      Meteor.call.apply(this, args);
      return deferred.promise;
    };
  }
]);
