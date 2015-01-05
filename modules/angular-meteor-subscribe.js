'use strict';
var angularMeteorSubscribe = angular.module('angular-meteor.subscribe', []);

angularMeteorSubscribe.service('$meteorSubscribe', ['$q',
  function ($q) {
    this.subscribe = function(){
      var deferred = $q.defer();
      var args = Array.prototype.slice.call(arguments);
      var subscription = null;

      // callbacks supplied as last argument
      args.push({
        onReady: function () {
          deferred.resolve(subscription);
        },
        onError: function (err) {
          deferred.reject(err);
        }
      });

      subscription = Meteor.subscribe.apply(this, args);

      return deferred.promise;
    };
  }]);