'use strict';

var Meteor;

describe('Given the subscribe service', function() {


  describe('when calling subscribe()', function() {

    var $meteorSubscribe, $rootScope;

    beforeEach(function() {

      module('angular-meteor.subscribe');

      inject(function(_$meteorSubscribe_, _$rootScope_) {
        $meteorSubscribe = _$meteorSubscribe_;
        $rootScope = _$rootScope_;
      });

    });

    it('should call Meteor.subscribe, pass the callbacks and return a promise', function() {

      Meteor = {
        subscribe: function(methodName, options) {
          options.onReady()
        }
      };

      var successFn = jasmine.createSpy('spy');

      var result = $meteorSubscribe.subscribe('myCollection').then(successFn);

      expect(typeof result).toBe('object');

      $rootScope.$apply();

      expect(successFn).toHaveBeenCalledWith(null);

    });


    it('should handle a failed Meteor.subscribe promise response', function() {

      Meteor = {
        subscribe: function(methodName, options) {
          options.onError('error');
        }
      };

      var failedFn = jasmine.createSpy('spy');

      $meteorSubscribe.subscribe('myCollection').then(false, failedFn);

      $rootScope.$apply();

      expect(failedFn).toHaveBeenCalledWith('error');

    });

  });

});
