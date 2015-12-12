'use strict';

var angularMeteorCamera = angular.module('angular-meteor.camera', ['angular-meteor.utils']);

// requires package 'mdg:camera'
angularMeteorCamera.service('$meteorCamera', [
  '$q', '$meteorUtils',
  function ($q, $meteorUtils) {
    console.warn('[angular-meteor.camera] Please note that this module is deprecated since 1.3.0 and will be removed in 1.4.0! http://info.meteor.com/blog/angular-meteor-1.3');
    var pack = Package['mdg:camera'];
    if (!pack) return;

    var MeteorCamera = pack.MeteorCamera;

    this.getPicture = function(options){
      console.warn('[angular-meteor.camera.getPicture] Please note that this method is deprecated since 1.3.0 and will be removed in 1.4.0! http://info.meteor.com/blog/angular-meteor-1.3');

      options = options || {};
      var deferred = $q.defer();
      MeteorCamera.getPicture(options, $meteorUtils.fulfill(deferred));
      return deferred.promise;
    };
  }
]);
