describe('$meteorStopper service', function() {
  var $meteorStopper;
  var $rootScope;
  var $scope;
  var $mock;

  var $meteorMock = function() {
    return {
      stop: function() {}
    };
  };

  beforeEach(angular.mock.module('angular-meteor.stopper'));

  beforeEach(angular.mock.inject(function(_$meteorStopper_, _$rootScope_) {
    $meteorStopper = _$meteorStopper_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $scope.$meteorMock = $meteorStopper($meteorMock);
    $mock = $scope.$meteorMock();
  }));

  describe('#subscribe()', function() {
    beforeEach(function() {
      spyOn(Meteor, 'subscribe').and.callThrough();
    });

    it('should call meteor subscription with scope as the context', function() {
      $mock.subscribe();
      expect(Meteor.subscribe.calls.mostRecent().object).toEqual($scope);
    });
  });

  describe('scope destruction', function() {
    beforeEach(function() {
      spyOn($mock, 'stop');
    });

    it('should stop meteor entity listeners on scope destruction', function() {
      $scope.$destroy();
      expect($mock.stop.calls.count()).toEqual(1);
    });
  });
});