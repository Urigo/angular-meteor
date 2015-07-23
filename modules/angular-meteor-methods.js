'use strict';
var angularMeteorMethods = angular.module('angular-meteor.methods', []);

angularMeteorMethods.service('$meteorMethods', ['$q',
  function ($q) {
    this.call = function(){

      var deferred = $q.defer();

      Array.prototype.push.call(arguments, function (err, data) {
        if (err)
          deferred.reject(err);
        else
          deferred.resolve(data);
      });
      Meteor.call.apply(this, arguments);

      return deferred.promise;
    };
  }]);