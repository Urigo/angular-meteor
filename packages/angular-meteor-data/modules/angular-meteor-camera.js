'use strict';

var angularMeteorCamera = angular.module('angular-meteor.camera', ['angular-meteor.utils']);

// requires package 'mdg:camera'
angularMeteorCamera.service('$meteorCamera', [
  '$q', '$meteorUtils',
  function ($q, $meteorUtils) {
    console.warn('[angular-meteor.camera] Please note that this module has moved to a separate package and is deprecated since 1.3.0 and will be removed in 1.4.0! For more info: http://www.angular-meteor.com/api/1.3.0/camera');
    var pack = Package['mdg:camera'];
    if (!pack) return;

    var MeteorCamera = pack.MeteorCamera;

    this.getPicture = function(options){
      console.warn('[angular-meteor.camera] Please note that this module has moved to a separate package and is deprecated since 1.3.0 and will be removed in 1.4.0! For more info: http://www.angular-meteor.com/api/1.3.0/camera');

      options = options || {};
      var deferred = $q.defer();
      MeteorCamera.getPicture(options, $meteorUtils.fulfill(deferred));
      return deferred.promise;
    };
  }
]);
