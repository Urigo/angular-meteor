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
  describe('stripDollarPrefixedKeys', function () {

    it('should remove keys with $ prefix', function(){

      var result = $meteorUtils.stripDollarPrefixedKeys({'$foo': 1, '$$baz': 3, bar : 2});
      expect(result.hasOwnProperty('$foo')).toBe(false);
      expect(result.hasOwnProperty('$$baz')).toBe(false);
      expect(result.bar).toEqual(2);

    });
    it('should ignore FS.File instances', function(){

      var cfsExits = typeof window.FS === 'object';
      if(!cfsExits){
        window.FS = {
          File : function(){}
        };
      }

      var fsFile = new FS.File();
      var result = $meteorUtils.stripDollarPrefixedKeys(fsFile);

      if(!cfsExits){ // clean up
        delete window.FS;
      }
      expect(result).toBe(fsFile);

    });
    it('should ignore Date instances', function(){

      var input = new Date();
      var result = $meteorUtils.stripDollarPrefixedKeys(input);

      expect(result).toBe(input);

    });
    it('should ignore File instances', function(){

      var input = new File([], "myfile.jpg");
      var result = $meteorUtils.stripDollarPrefixedKeys(input);

      expect(result).toBe(input);

    });
  });
});
