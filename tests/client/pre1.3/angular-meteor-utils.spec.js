import 'angular-meteor';

import {chai} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:sinon';

const expect = chai.expect;

describe('$meteorUtils service', function () {

  var $meteorUtils, $scope, $rootScope;

  beforeEach(function () {

    angular.mock.module('angular-meteor.utils');
    // Injecting Services to use
    angular.mock.inject(function (_$meteorUtils_, _$rootScope_) {
      $meteorUtils = _$meteorUtils_;
      $rootScope = _$rootScope_;
      // Creates a new child scope.
      $scope = $rootScope.$new();
    });

  });

  describe('getCollectionByName', function () {

    it('should return the mongo collection when called with an existing collection', function () {
      var collectionName = 'aCollection';
      new Mongo.Collection(collectionName);

      var coll = $meteorUtils.getCollectionByName('aCollection');

      expect(coll).to.be.an.instanceof(Mongo.Collection);
      expect(coll._name).to.equal(collectionName);
    });

    it('should return "undefined" when called with a non-existing collection', function () {
      var output = $meteorUtils.getCollectionByName('myCollectionFake');
      expect(output).to.be.undefined;
    });
  });

  describe('autorun', function () {

    it('should return a stoppable computation handle', function () {
      var dependency = new Tracker.Dependency();
      var computationSpy = sinon.spy(function() {
        dependency.depend();
      });

      var handle = $meteorUtils.autorun($scope, computationSpy);
      handle.stop();
      dependency.changed();
      Tracker.flush();

      expect(computationSpy.calledOnce).to.be.true;
    });

    it('should call $scope.$apply() when dependency changes', angular.mock.inject(function($timeout) {
      var dependency = new Tracker.Dependency();
      $meteorUtils.autorun($scope, function fn() {
        dependency.depend();
      });
      sinon.stub($rootScope, '$apply');

      dependency.changed();
      Tracker.flush();
      $timeout.flush();

      expect($scope.$apply.calledOnce).to.be.true;
    }));

    it('should stop the computation when the collection is destroyed', function() {
      var handle = $meteorUtils.autorun($scope, function fn() {});
      sinon.stub(handle, 'stop');
      $scope.$destroy();
      expect(handle.stop.calledOnce).to.be.true;
    });
  });
  describe('stripDollarPrefixedKeys', function () {

    it('should remove keys with $ prefix', function(){

      var result = $meteorUtils.stripDollarPrefixedKeys({'$foo': 1, '$$baz': 3, bar : 2});
      expect(result.hasOwnProperty('$foo')).to.be.false;
      expect(result.hasOwnProperty('$$baz')).to.be.false;
      expect(result.bar).to.equal(2);

    });


    it('should ignore Date instances', function(){

      var input = new Date();
      var result = $meteorUtils.stripDollarPrefixedKeys(input);

      expect(result).to.equal(input);

    });
  });

  describe('fulfill()', function() {
    var deferred = {
      resolve: function() {},
      reject: function() {}
    };

    beforeEach(function() {
      sinon.stub(deferred, 'resolve');
      sinon.stub(deferred, 'reject');
    });

    afterEach(function() {
      deferred.resolve.restore();
      deferred.reject.restore();
    });

    it('should return a function which fulfills a promise', function() {
      var fulfill = $meteorUtils.fulfill(deferred);

      var err = Error();
      fulfill(err);
      expect(deferred.reject.calledOnce).to.be.true;
      expect(deferred.reject.args[0][0]).to.deep.equal(err);

      var result = {};
      fulfill(null, result);
      expect(deferred.resolve.calledOnce).to.be.true;
      expect(deferred.resolve.args[0][0]).to.deep.equal(result);
    });

    it('should fulfill promise with the bound results', function() {
      var err = Error();
      var result = {};
      var fulfill = $meteorUtils.fulfill(deferred, err, result);

      fulfill();
      expect(deferred.resolve.calledOnce).to.be.true;
      expect(deferred.resolve.args[0][0]).to.deep.equal(result);

      fulfill(Error());
      expect(deferred.reject.calledOnce).to.be.true;
      expect(deferred.reject.args[0][0]).to.deep.equal(err);
    });

    it('should return bound result of an async callback from an arbitrary function', function() {
      var fn = function(action, _id) {
        return {_id: _id, action: action };
      };
      var createFulfill = _.partial(fn, 'inserted');
      var fulfill = $meteorUtils.fulfill(deferred, err, result);
      var err = Error();
      var result = '_id';

      fulfill(null, createFulfill(result));
      expect(deferred.resolve.calledOnce).to.be.true;
      expect(deferred.resolve.args[0][0]).to.deep.equal({ _id: result, action: 'inserted' });

      fulfill(Error());
      expect(deferred.reject.calledOnce).to.be.true;
      expect(deferred.reject.args[0][0]).to.deep.equal(err);
    });
  });

  describe('promissor', function() {
    it('should create a function which invokes method with the given arguments and returns a promise', function(done) {
      var next = _.once(done);
      var obj = { method: function() {} };
      var promissor = $meteorUtils.promissor(obj, 'method');

      sinon.spy(obj, 'method');
      promissor(1, 2, 3);
      expect(obj.method.calledWith(1, 2, 3, sinon.match.func)).to.be.true;

      obj.method = sinon.spy(function(callback) {
        callback(null, 'result');
      });

      promissor().then(function(result) {
        expect(result).to.equal('result');
        next();
      });

      obj.method = sinon.spy(function(callback) {
        callback('error');
      });

      promissor().catch(function(err) {
        expect(err).to.equal('error');
        next();
      });

      $rootScope.$apply();
    });
  });
});
