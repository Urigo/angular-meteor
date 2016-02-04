'use strict';
var angularMeteorSubscribe = angular.module('angular-meteor.subscribe', []);

angularMeteorSubscribe.service('$meteorSubscribe', ['$q',
  function ($q) {

    var self = this;

    this._subscribe = function(scope, deferred, args) {

      console.warn('[angular-meteor.subscribe] Please note that this module is deprecated since 1.3.0 and will be removed in 1.4.0! Replace it with the new syntax described here: http://www.angular-meteor.com/api/1.3.1/subscribe');

      var subscription = null;
      var lastArg = args[args.length - 1];

      // User supplied onStop callback
      // save it for later use and remove
      // from subscription arguments
      if (angular.isObject(lastArg) &&
          angular.isFunction(lastArg.onStop)) {
        var onStop = lastArg.onStop;

        args.pop();
      }

      args.push({
        onReady: function() {
          deferred.resolve(subscription);
        },
        onStop: function(err) {
          if (!deferred.promise.$$state.status) {
            if (err)
              deferred.reject(err);
            else
              deferred.reject(new Meteor.Error("Subscription Stopped",
                "Subscription stopped by a call to stop method. Either by the client or by the server."));
          } else if (onStop)
            // After promise was resolved or rejected
            // call user supplied onStop callback.
            onStop.apply(this, Array.prototype.slice.call(arguments));

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
