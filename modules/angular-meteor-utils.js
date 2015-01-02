'use strict';
var angularMeteorUtils = angular.module('angular-meteor.utils', []);

angularMeteorUtils.service('$meteorUtils', [
  function () {
    this.getCollectionByName = function(string){
      for (var globalObject in window) {
        if (window[globalObject] instanceof Meteor.Collection) {
          if (window[globalObject]._name == string){
            return window[globalObject];
            break;
          }
        }
      }
      return undefined; // if none of the collections match
    };
  }]);