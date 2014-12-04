'use strict';
var angularMeteorSubscribe = angular.module('angular-meteor.subscribe', []);

angularMeteorSubscribe.service('$subscribe', ['$q',
  function ($q) {
    this.subscribe = function(){
      var deferred = $q.defer();
      var args = Array.prototype.slice.call(arguments);

      // callbacks supplied as last argument
      args.push({
        onReady: function () {
          deferred.resolve();
        },
        onError: function (err) {
          deferred.reject(err);
        }
      });

      var subscription = Meteor.subscribe.apply(this, args);

      return deferred.promise;
    };
  }]);