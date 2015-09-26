describe('$meteorSubscribe service', function () {
  var $meteorSubscribe,
    $rootScope,
    $scope,
    ready,
    stop;

  var $subscriptionHandleMock = function () {
    return {
      stop: function () {
      }
    };
  };

  beforeEach(angular.mock.module('angular-meteor'));
  beforeEach(angular.mock.inject(function (_$meteorSubscribe_, _$rootScope_) {
    $meteorSubscribe = _$meteorSubscribe_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
  }));

  beforeEach(function () {
    spyOn(Meteor, 'subscribe').and.callFake(function () {
      stop = arguments[arguments.length - 1].onStop;
      ready = arguments[arguments.length - 1].onReady;

      return $subscriptionHandleMock;
    });
  });

  describe('$scope.$meteorSubscribe', function () {

    it('should call Meteor.subscribe with publication arguments and event callbacks ', function () {
      $scope.$meteorSubscribe('subscription', 1, 2, 3);

      expect(Meteor.subscribe)
        .toHaveBeenCalledWith('subscription', 1, 2, 3, {
          onReady: jasmine.any(Function),
          onStop: jasmine.any(Function)
        });
    });

    it('should return promise that is resolved when subscription is ready', function (done) {
      $scope.$meteorSubscribe('subscription', 1, 2, 3)
        .then(function (handle) {
          expect(handle).toEqual($subscriptionHandleMock);
        })
        .finally(done);

      ready();
      $rootScope.$digest();
    });

    it('should return promise that is rejected with a Meteor.Error', function (done) {
      var promise = $scope.$meteorSubscribe('subscription', 1, 2, 3);

      promise.catch(function (err) {
        if (err instanceof Meteor.Error) done();
        else done.fail();
      });

      stop();
      $rootScope.$digest();
    });

  });

  describe('pass onStop argument', function () {

    it('should call onStop with Meteor.Error when onStop event called for subscription that was resolved', function (done) {
      var error = new Meteor.Error('Error', 'reason');

      $scope.$meteorSubscribe('subscription', 1, 2, 3,
        {
          onStop: function (err) {
            if (err === error) done();
            else done.fail();
          }
        });

      ready();
      stop(error);
    });

    it('should call onStop when subscription is stopped', function (done) {
      $scope.$meteorSubscribe('subscription', 1, 2, 3,
        {
          onStop: function (err) {
            if (!err) done();
            else done.fail();
          }
        });

      ready();
      stop();
    });
  });
});
