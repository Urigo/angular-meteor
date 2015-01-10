'use strict';
var angularMeteorUtils = angular.module('angular-meteor.utils', []);

angularMeteorUtils.service('$meteorUtils', [
  function () {
    this.getCollectionByName = function(string){
      for (var globalObject in window) {
        if (window[globalObject] instanceof Mongo.Collection) {
          if (window[globalObject]._name == string){
            return window[globalObject];
          }
        }
      }
      return undefined; // if none of the collections match
    };
    this.autorun = function(scope, fn) {
      // wrapping around Deps.autorun
      var comp = Tracker.autorun(function(c) {
        fn(c);

        // this is run immediately for the first call
        // but after that, we need to $apply to start Angular digest
        if (!c.firstRun) setTimeout(function() {
          // wrap $apply in setTimeout to avoid conflict with
          // other digest cycles
          scope.$apply();
        }, 0);
      });
      // stop autorun when scope is destroyed
      scope.$on('$destroy', function() {
        comp.stop();
      });
      // return autorun object so that it can be stopped manually
      return comp;
    };
  }]);
