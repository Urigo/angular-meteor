'use strict';
var angularMeteorSubscribe = angular.module('angular-meteor.subscribe', []);

angularMeteorSubscribe.service('$meteorSubscribe', ['$q',
  function ($q) {
    var self = this;

    this._subscribe = function(scope, deferred, args) {
      var subscription = null;

      args.push({
        onReady: function() {
          deferred.resolve(subscription);
        },
        onError: function(err) {
          deferred.reject(err);
        }
      });

      subscription =  Meteor.subscribe.apply(scope, args);

      return subscription;
    };

    this.subscribe = function(){
      var deferred = $q.defer();
      var args = Array.prototype.slice.call(arguments);
      var subscription = null;

      self._subscribe(this, deferred, args);

      return deferred.promise;
    };
  }]);

angularMeteorSubscribe.run(['$rootScope', '$q', '$meteorSubscribe',
  function($rootScope, $q, $meteorSubscribe) {
    Object.getPrototypeOf($rootScope).$meteorSubscribe = function() {
      var deferred = $q.defer();
      var args = Array.prototype.slice.call(arguments);

      var subscription = $meteorSubscribe._subscribe(this, deferred, args);

      this.$on('$destroy', function() {
        subscription.stop();
      });

      return deferred.promise;
    };
}]);
