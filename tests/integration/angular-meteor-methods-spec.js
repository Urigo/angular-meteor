describe('$meteorMethods service', function() {
  var $meteorMethods;
  var $rootScope;

  beforeEach(angular.mock.module('angular-meteor.methods'));

  beforeEach(angular.mock.inject(function(_$rootScope_, _$meteorMethods_) {
    $meteorMethods = _$meteorMethods_;
    $rootScope = _$rootScope_;
  }));

  describe('call()', function() {
    beforeEach(function() {
      spyOn(Meteor, 'call').and.callFake(function() {
        var callback = _.last(arguments);
        callback();
      });
    });

    it('should call method and return a promise', function(done) {
      var promise = $meteorMethods.call(1, 2, 3);
      expect(Meteor.call).toHaveBeenCalledWith(1, 2, 3, jasmine.any(Function));
      promise.then(done);
      $rootScope.$apply();
    });
  });
});