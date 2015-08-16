'use strict';
var angularMeteorCamera = angular.module('angular-meteor.camera', ['angular-meteor.utils']);

angularMeteorCamera.service('$meteorCamera', [
  '$q', '$meteorUtils',
  function ($q, $meteorUtils) {
    var pack = Package['mdg:camera'];
    var MeteorCamera = pack && pack.MeteorCamera;

    this.getPicture = function(options){
      if (!pack)
        throw Error('$meteorCamera error - mdg:camera package must be added before use');

      options = options || {};
      var deferred = $q.defer();
      MeteorCamera.getPicture(options, $meteorUtils.fulfill(deferred));
      return deferred.promise;
    };
  }
]);
