'use strict';

var angularMeteorCamera = angular.module('angular-meteor.camera', ['angular-meteor.utils']);

// requires package 'mdg:camera'
angularMeteorCamera.service('$meteorCamera', [
  '$q', '$meteorUtils',
  function ($q, $meteorUtils) {
    var pack = Package['mdg:camera'];
    if (!pack) return;

    var MeteorCamera = pack.MeteorCamera;

    this.getPicture = function(options){
      options = options || {};
      var deferred = $q.defer();
      MeteorCamera.getPicture(options, $meteorUtils.fulfill(deferred));
      return deferred.promise;
    };
  }
]);
