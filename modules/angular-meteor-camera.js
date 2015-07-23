'use strict';
var angularMeteorUtils = angular.module('angular-meteor.camera', []);

angularMeteorUtils.service('$meteorCamera', ['$q',
  function ($q) {
    this.getPicture = function(options){
      if (!options)
        options = {};

      var deferred = $q.defer();

      MeteorCamera.getPicture(options, function (error, data) {
        if (error)
          deferred.reject(error);

        if (data)
          deferred.resolve(data);
      });

      return deferred.promise;
    };
  }]);
