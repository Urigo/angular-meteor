'use strict';

var Mongo, Tracker;

describe('Given the Angular Meteor Utils Service', function () {

  var $meteorUtils, $scope;

  beforeEach(function () {

    module('angular-meteor.utils');
    // Injecting Services to use
    inject(function (_$meteorUtils_, _$rootScope_) {
      $meteorUtils = _$meteorUtils_;
      // Creates a new child scope.
      $scope = _$rootScope_.$new();
    });

  });

  describe('when using GetCollectionByName(collectionName)', function () {

    beforeEach(function () {

      // Mocking Collection
      function Collection() {
      }

      Collection.prototype._name = 'myCollection';
      Mongo = {Collection: Collection};
      window.myCol = new Mongo.Collection;
    });

    it('should find and return a mongo collection by name', function () {
      var output = $meteorUtils.getCollectionByName('myCollection');
      expect(output).toEqual(window.myCol);

    });

    it('should return "undefined" if it can\'t find the collection', function () {

      var output = $meteorUtils.getCollectionByName('myCollectionFake');
      expect(output).toBeUndefined();

    })
  });

  describe('when using autorun(scope, function)', function () {

    beforeEach(function () {

      // Mocking Tracker behavior
      Tracker = {
        autorun: function (fn) {
          return 'autorun';
        }
      }
    });

    it('should return the "autorun" object so that can be stopped manually', function () {


      var output = $meteorUtils.autorun($scope, function fn() {});
      expect(output).toEqual('autorun');

    });

    describe('when firstRun is set to: false', function() {

      beforeEach(function() {

        Tracker = {
          autorun: function (fn) {
            fn({firstRun: false})
          }
        };

        spyOn($scope, '$apply');

      });

      it('should call $scope.$apply()', function(done) {

        $meteorUtils.autorun($scope, function fn() {});

        setTimeout(function() {
          expect($scope.$apply).toHaveBeenCalled();
          done()
        }, 0);
      });

    });

    describe('when destroying the $scope', function() {

      beforeEach(function() {

        Tracker = {
          autorun: function (fn) {
            fn({firstRun: true});
            return {
              stop: jasmine.createSpy('spy')
            }
          }
        };

      });

      it('should stop the "autorun"', function() {

        var output = $meteorUtils.autorun($scope, function fn() {});
        $scope.$destroy();
        expect(output.stop).toHaveBeenCalled();

      });
    });

  });

});
