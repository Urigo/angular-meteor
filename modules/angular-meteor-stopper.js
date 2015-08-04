'use strict';

var angularMeteorStopper = angular.module('angular-meteor.stopper',
  ['angular-meteor.subscribe']);

angularMeteorStopper.factory('$meteorStopper', ['$q', '$meteorSubscribe',
  function($q, $meteorSubscribe) {
    function $meteorStopper($meteorEntity) {
      return function() {
        var args = Array.prototype.slice.call(arguments);
        var meteorEntity = $meteorEntity.apply(this, args);
        angular.extend(meteorEntity, $meteorStopper);

        this.$on('$destroy', function () {
          meteorEntity.stop();
          if (meteorEntity.subscription) meteorEntity.subscription.stop();
        });

        return meteorEntity;
      };
    }

    $meteorStopper.subscribe = function() {
      var args = Array.prototype.slice.call(arguments);
      this.subscription = $meteorSubscribe._subscribe(this, $q.defer(), args);
      return this;
    };

    return $meteorStopper;
}]);