describe('$meteorUtils service', function () {

  var $meteorUtils, $scope, $rootScope;

  beforeEach(function () {

    angular.mock.module('angular-meteor.utils');
    // Injecting Services to use
    angular.mock.inject(function (_$meteorUtils_, _$rootScope_) {
      $meteorUtils = _$meteorUtils_;
      $rootScope = _$rootScope_;
      // Creates a new child scope.
      $scope = $rootScope.$new();
    });

  });

  describe('getCollectionByName', function () {

    it('should return the mongo collection when called with an existing collection', function () {
      var collectionName = 'aCollection';
      new Mongo.Collection(collectionName);

      var coll = $meteorUtils.getCollectionByName('aCollection');

      expect(coll).toEqual(jasmine.any(Mongo.Collection));
      expect(coll._name).toEqual(collectionName);
    });

    it('should return "undefined" when called with a non-existing collection', function () {
      var output = $meteorUtils.getCollectionByName('myCollectionFake');
      expect(output).toBeUndefined();
    })
  });

  describe('autorun', function () {

    it('should return a stoppable computation handle', function () {
      var dependency = new Tracker.Dependency();
      var computationSpy = jasmine.createSpy('computationSpy').and.callFake(function() {
        dependency.depend();
      });

      var handle = $meteorUtils.autorun($scope, computationSpy);
      handle.stop();
      dependency.changed();
      Tracker.flush();

      expect(computationSpy.calls.count()).toBe(1);
    });

    it('should call $scope.$apply() when dependency changes', angular.mock.inject(function($timeout) {
      var dependency = new Tracker.Dependency();
      $meteorUtils.autorun($scope, function fn() {
        dependency.depend();
      });
      spyOn($rootScope, '$apply');

      dependency.changed();
      Tracker.flush();
      $timeout.flush();

      expect($scope.$apply).toHaveBeenCalled();
    }));

    it('should stop the computation when the collection is destroyed', function() {
      var handle = $meteorUtils.autorun($scope, function fn() {});
      spyOn(handle, 'stop');
      $scope.$destroy();
      expect(handle.stop).toHaveBeenCalled();
    });
  });
});
