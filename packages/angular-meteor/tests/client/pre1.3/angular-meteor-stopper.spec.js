import 'angular-meteor';

import {chai} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:sinon';

const expect = chai.expect;

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
      sinon.spy(Meteor, 'subscribe');
    });

    afterEach(function() {
      Meteor.subscribe.restore();
    });

    it('should call meteor subscription with scope as the context', function() {
      $mock.subscribe();
      expect(Meteor.subscribe.thisValues[0]).to.equal($scope);
    });
  });

  describe('scope destruction', function() {
    beforeEach(function() {
      sinon.spy($mock, 'stop');
    });

    afterEach(function() {
      $mock.stop.restore();
    });

    it('should stop meteor entity listeners on scope destruction', function() {
      $scope.$destroy();
      expect($mock.stop.calledOnce).to.be.true;
    });
  });
});
