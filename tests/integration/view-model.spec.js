describe('angular-meteor.view-model', function() {
  beforeEach(angular.mock.module('angular-meteor'));

  var $rootScope;
  var $Mixer;

  beforeEach(angular.mock.inject(function (_$rootScope_, _$Mixer_, _$reactive_) {
    $rootScope = _$rootScope_;
    $Mixer = _$Mixer_;
    $reactive = _$reactive_;
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

      $Mixer.mixin(Mixin);
      scope = $rootScope.$new();
    });

    afterEach(function() {
      delete $rootScope.$$ChildScope;
      $Mixer._mixout(Mixin);
      scope.$destroy();
    });

    it('should extend child scope', function() {
      expect(scope.viewModel).toEqual(jasmine.any(Function));
    });

    it('should extend view model', function() {
      var vm = scope.viewModel({});
      expect(vm.vmProp).toEqual('vmProp');
      expect(vm.scopeProp).toBeUndefined();
      expect(vm.$method).toEqual(jasmine.any(Function));
      expect(vm.$$hidden).toBeUndefined();
    });

    it('should bind methods to scope', function() {
      var vm = scope.viewModel({});
      vm.$method();

      expect(Mixin.$method.calls.mostRecent().object).toEqual(scope);
    });
  });

  describe('$reactive', function() {
    var scope;

    beforeEach(function() {
      scope = $rootScope.$new();
    });

    afterEach(function() {
      scope.$destroy();
    });

    it('should call scope.viewModel()', function() {
      var vm = {};

      spyOn(scope, 'viewModel').and.callThrough();
      $reactive(vm).attach(scope);

      expect(scope.viewModel).toHaveBeenCalledWith(vm);
    });
  });
});
