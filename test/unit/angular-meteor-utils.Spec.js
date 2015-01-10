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
      expect(output).toEqual(undefined);

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

      function fn() {
      }

      var output = $meteorUtils.autorun($scope, fn);
      expect(output).toEqual('autorun');

    });

  });

});
