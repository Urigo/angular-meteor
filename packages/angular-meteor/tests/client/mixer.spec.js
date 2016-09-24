import 'angular-meteor';

import {chai} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:sinon';

const expect = chai.expect;

describe('angular-meteor.mixer', function() {
  beforeEach(angular.mock.module('angular-meteor'));

  var $compile;
  var $rootScope;
  var $Mixer;

  beforeEach(angular.mock.inject(function (_$rootScope_, _$Mixer_) {
    $rootScope = _$rootScope_;
    $Mixer = _$Mixer_;
  }));

  describe('$Mixer', function() {
    var Mixin;

    beforeEach(function() {
      Mixin = function() {
        this.prop = 'prop';
      };

      Mixin.$method = angular.noop;

      $Mixer.mixin(Mixin);
    });

    afterEach(function() {
      $Mixer._mixout(Mixin);
    });

    it('should extend root scope', function() {
      expect($rootScope.prop).to.equal('prop');
      expect($rootScope.$method).to.be.a('function');
    });

    it('should extend child scope', function() {
      var scope = $rootScope.$new();
      expect(scope.prop).to.equal('prop');
      expect(scope.$method).to.be.a('function');
      scope.$destroy();
    });

    it('should extend isolated scope', function() {
      var scope = $rootScope.$new(true);
      expect(scope.prop).to.equal('prop');
      expect(scope.$method).to.be.a('function');
      scope.$destroy();
    });
  });
});
