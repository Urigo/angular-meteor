import 'angular-meteor';

import {chai} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:sinon';

const expect = chai.expect;

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

      Mixin.$method = function(fn) {
        if (_.isFunction(fn)) return fn.apply(this);
      };

      Mixin.$$hidden = sinon.spy();

      $Mixer.mixin(Mixin);
      scope = $rootScope.$new();
    });

    afterEach(function() {
      delete $rootScope.$$ChildScope;
      $Mixer._mixout(Mixin);
      scope.$destroy();
    });

    it('should extend child scope', function() {
      expect(scope.viewModel).to.be.a('function');
    });

    it('should extend view model', function() {
      var vm = scope.viewModel({});
      expect(vm.vmProp).to.equal('vmProp');
      expect(vm.scopeProp).to.be.undefined;
      expect(vm.$method).to.be.a('function');
      expect(vm.$$hidden).to.be.undefined;
    });

    it('should bind methods to scope', function() {
      var vm = scope.viewModel({});

      vm.$method(function() {
        expect(this).to.equal(scope);
        expect($Mixer.caller).to.equal(vm);
      });
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

      sinon.spy(scope, 'viewModel');
      $reactive(vm).attach(scope);

      expect(scope.viewModel.calledWith(vm)).to.be.true;
      scope.viewModel.restore();
    });
  });
});
