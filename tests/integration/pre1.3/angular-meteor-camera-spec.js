describe('$meteorCamera service', function() {
  var MeteorCamera = Package['mdg:camera'].MeteorCamera;
  var $meteorCamera;
  var $rootScope;

  beforeEach(angular.mock.module('angular-meteor.camera'));

  beforeEach(angular.mock.inject(function(_$rootScope_, _$meteorCamera_) {
    $meteorCamera = _$meteorCamera_;
    $rootScope = _$rootScope_;
  }));

  describe('getPicture()', function() {
    beforeEach(function() {
      spyOn(MeteorCamera, 'getPicture').and.callFake(function(options, callback) {
        callback();
      });
    });

    it('should get picture and return a promise', function(done) {
      var options = {};
      var promise = $meteorCamera.getPicture();
      expect(MeteorCamera.getPicture).toHaveBeenCalled();
      expect(MeteorCamera.getPicture.calls.mostRecent().args.length).toEqual(2);
      expect(MeteorCamera.getPicture.calls.mostRecent().args[0]).toEqual(options);
      promise.then(done);
      $rootScope.$apply();
    });
  });
});