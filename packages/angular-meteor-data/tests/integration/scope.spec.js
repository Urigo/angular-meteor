var testedModule = 'angular-meteor.scope';

describe(testedModule, function () {
  beforeEach(angular.mock.module(testedModule));

  var $rootScope;
  var $$Mixer;

  beforeEach(angular.mock.inject(function (_$rootScope_, _$$Mixer_) {
    $rootScope = _$rootScope_;
    $$Mixer = _$$Mixer_;
  }));

  describe('Scope', function() {
    var scope;
    var Mixin;

    beforeEach(function() {
      Mixin = function() {
        this.prop = 'prop';
      };

      Mixin.$method = angular.noop;

      $$Mixer.mixin(Mixin);
      scope = $rootScope.$new();
    });

    afterEach(function() {
      delete $rootScope.$$ChildScope;
      $$Mixer.mixout(Mixin);
      scope.$destroy();
    });

    it('should extend child scope', function() {
      expect(scope.prop).toEqual('prop');
      expect(scope.$method).toEqual(jasmine.any(Function));
    });
  });
});