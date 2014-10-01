'use strict';
var ngMeteorSubscribe = angular.module('ngMeteor.subscribe', []);

ngMeteorSubscribe.service('$subscribe', ['$q',
  function ($q) {
    this.subscribe = function(name, subscribeArguments){
      var deferred = $q.defer();

      var subscription = Meteor.subscribe(name);

      Deps.autorun(function() {
        if ( subscription.ready() ) {
          deferred.resolve();
        }
      });

      return deferred.promise;
    };
  }]);