import 'angular-meteor';

import {chai} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:sinon';

const expect = chai.expect;

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
      sinon.stub(Meteor, 'call', function() {
        var callback = _.last(arguments);
        callback();
      });
    });

    afterEach(function() {
      Meteor.call.restore();
    });

    it('should call method and return a promise', function(done) {
      var promise = $meteorMethods.call(1, 2, 3);
      expect(Meteor.call.calledWith(1, 2, 3, sinon.match.func)).to.be.true;
      promise.then(done);
      $rootScope.$apply();
    });
  });
});
