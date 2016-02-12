/*global
 angular, _, Meteor
 */

'use strict';

var angularMeteorMethods = angular.module('angular-meteor.methods', ['angular-meteor.utils']);

angularMeteorMethods.service('$meteorMethods', [
  '$q', '$meteorUtils', '$angularMeteorSettings',
  function($q, $meteorUtils, $angularMeteorSettings) {
    this.call = function(){
      if (!$angularMeteorSettings.suppressWarnings)
        console.warn('[angular-meteor.$meteor.call] Please note that this method is deprecated since 1.3.0 and will be removed in 1.4.0! For more info: http://www.angular-meteor.com/api/1.3.0/methods. You can disable this warning by following this guide http://www.angular-meteor.com/api/1.3.6/settings');

      var deferred = $q.defer();
      var fulfill = $meteorUtils.fulfill(deferred);
      var args = _.toArray(arguments).concat(fulfill);
      Meteor.call.apply(this, args);
      return deferred.promise;
    };
  }
]);
