'use strict';
var angularMeteorSubscribe = angular.module('angular-meteor.subscribe', []);

angularMeteorSubscribe.service('$subscribe', ['$q',
  function ($q) {
    this.subscribe = function(){
      var deferred = $q.defer();

      var subscription = Meteor.subscribe.apply(this, arguments);

      Tracker.autorun(function() {
        if ( subscription.ready() ) {
          deferred.resolve();
        }
      });

      return deferred.promise;
    };
  }]);