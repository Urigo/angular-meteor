var testedModule = 'angular-meteor.view-model';

describe(testedModule, function () {
  beforeEach(angular.mock.module(testedModule));

  var $rootScope;
  var $$Mixer;

  beforeEach(angular.mock.inject(function (_$rootScope_, _$$Mixer_) {
    $rootScope = _$rootScope_;
    $$Mixer = _$$Mixer_;
  }));

  describe('$$ViewModel', function() {
    var scope;
    var Mixin;

    beforeEach(function() {
      Mixin = function(vm) {
        vm = vm || this;
        vm.vmProp = 'vmProp';
        this.scopeProp = 'scopeProp';
      };

      Mixin.$method = jasmine.createSpy();
      Mixin.$$hidden = jasmine.createSpy();

      $$Mixer.mixin(Mixin);
      scope = $rootScope.$new();
    });

    afterEach(function() {
      delete $rootScope.$$ChildScope;
      $$Mixer.mixout(Mixin);
      scope.$destroy();
    });

    it('should extend child scope', function() {
      expect(scope.$viewModel).toEqual(jasmine.any(Function));
    });

    it('should extend view model', function() {
      var vm = scope.$viewModel({});
      expect(vm.vmProp).toEqual('vmProp');
      expect(vm.scopeProp).toBeUndefined();
      expect(vm.$method).toEqual(jasmine.any(Function));
      expect(vm.$$hidden).toBeUndefined();
    });

    it('should bind methods to scope', function() {
      var vm = scope.$viewModel({});
      vm.$method();

      expect(Mixin.$method.calls.mostRecent().object).toEqual(scope);
    })
  });
});