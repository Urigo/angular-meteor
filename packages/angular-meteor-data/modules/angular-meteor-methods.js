'use strict';

var angularMeteorMethods = angular.module('angular-meteor.methods', ['angular-meteor.utils']);

angularMeteorMethods.service('$meteorMethods', [
  '$q', '$meteorUtils',
  function($q, $meteorUtils) {
    this.call = function(){
      var deferred = $q.defer();
      var fulfill = $meteorUtils.fulfill(deferred);
      var args = _.toArray(arguments).concat(fulfill);
      Meteor.call.apply(this, args);
      return deferred.promise;
    };
  }
]);