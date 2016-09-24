import 'angular-meteor';

import {chai} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:sinon';

const expect = chai.expect;

describe('angular-meteor.core', function() {
  beforeEach(angular.mock.module('angular-meteor'));

  var $rootScope;

  beforeEach(angular.mock.inject(function(_$rootScope_) {
    $rootScope = _$rootScope_;
  }));

  describe('$$Core', function() {
    it('should extend child scope', function() {
      var scope = $rootScope.$new();
      expect(scope.subscribe).to.be.a('function');
      expect(scope.autorun).to.be.a('function');
    });

    describe('autorun()', function() {
      var scope;

      beforeEach(function() {
        scope = $rootScope.$new();
      });

      afterEach(function() {
        scope.$destroy();
        if (Tracker.autorun.restore)
          Tracker.autorun.restore();
      });

      it('should call Tracker.autorun()', function() {
        var stop = sinon.spy();
        var stoppable = { stop: stop };
        sinon.stub(Tracker, 'autorun').returns(stoppable);

        scope.autorun(function() {});
        expect(Tracker.autorun.called).to.be.true;
      });

      it('should autostop computation', function() {
        var stop = sinon.spy();
        var stoppable = { stop: stop };
        sinon.stub(Tracker, 'autorun').returns(stoppable);

        scope.autorun(angular.noop);
        scope.$destroy();

        expect(stop.called).to.be.true;
      });

      it('should stop computation manually', function() {
        var stop = sinon.spy();
        var stoppable = { stop: stop };
        sinon.stub(Tracker, 'autorun').returns(stoppable);

        var computation = scope.autorun(angular.noop);
        computation.stop();

        expect(stop.called).to.be.true;
      });

      it('should call autorun function using view model as context', function() {
        var vm = scope.viewModel({});

        vm.autorun(function() {
          expect(this).to.equal(vm);
        });
      });

      it('should digest once autorun function is invoked', function() {
        scope.$digest = sinon.spy();
        scope.autorun(angular.noop);
        expect(scope.$digest.called).to.be.true;
      });

      it('should remove the destroy event listener once the computation has been stopped', function() {
        var stop = sinon.spy();
        var stoppable = { stop: stop };
        sinon.stub(Tracker, 'autorun').returns(stoppable);

        var computation = scope.autorun(angular.noop);
        computation.stop();
        scope.$destroy();

        expect(stop.calledOnce).to.be.true;
      });
    });

    describe('subscribe()', function() {
      var scope;

      beforeEach(function() {
        scope = $rootScope.$new();
      });

      afterEach(function() {
        scope.$destroy();
        if (Tracker.autorun.restore)
          Tracker.autorun.restore();
        if (Meteor.subscribe.restore)
          Meteor.subscribe.restore();
      });

      it('should call Meteor.subscribe()', function() {
        var subscription = { ready: angular.noop  };
        var subscribe = sinon.stub(Meteor, 'subscribe').returns(subscription);
        scope.subscribe('test', function() { return []; });
        expect(subscribe.called).to.be.true;
      });

      it('should autostop subscription', function() {
        var stop = sinon.spy();
        var stoppable = { stop: stop };
        var autorun = sinon.stub(Tracker, 'autorun').returns(stoppable);

        scope.subscribe('test');
        scope.$destroy();

        expect(stop.called).to.be.true;
      });

      it('should stop subscription manually', function() {
        var stop = sinon.spy();
        var stoppable = { stop: stop };
        var autorun = sinon.stub(Tracker, 'autorun').returns(stoppable);

        var subscription = scope.subscribe('test');
        subscription.stop();

        expect(stop.called).to.be.true;
      });

      it('should return subscription ready and subscriptionId properties', function(done) {
        var subscription = { ready: done, subscriptionId: 'my-subscription' };
        var subscribe = sinon.stub(Meteor, 'subscribe').returns(subscription);
        subscription = scope.subscribe('test');

        expect(subscription.subscriptionId).to.equal('my-subscription');
        subscription.ready();
      });

      it('should recompute subscription if parameters have been changed', function(done) {
        var next = _.after(2, done);
        var dependency = new Tracker.Dependency();

        scope.subscribe('test', function() {
          next();
          dependency.depend();
          return [];
        });

        Tracker.flush();
        dependency.changed();
      });

      it('should accept subscriptions calls with no function specified', function () {
        var subscription = { ready: angular.noop };
        var subscribe = sinon.stub(Meteor, 'subscribe').returns(subscription);

        scope.subscribe('test');
        expect(subscribe.calledWith('test', sinon.match.func)).to.be.true;
      });

      it('should call subscription function using view model as context', function (done) {
        var vm = scope.viewModel({});

        vm.subscribe('test', function () {
          expect(this).to.equal(vm);
          done();
        });
      });

      it('should call subscription callback using view model as context', function(done) {
        var vm = scope.viewModel({});

        sinon.stub(Meteor, 'subscribe', function(name, cb) {
          cb();
          return { ready: angular.noop };
        });

        vm.subscribe('test', angular.noop, function() {
          expect(this).to.equal(vm);
          done();
        });
      });

      it('should call subscription callbacks object using view model as context', function(done) {
        var vm = scope.viewModel({});

        var next = _.after(3, done);

        sinon.stub(Meteor, 'subscribe', function(name, cbs) {
          cbs.onReady();
          cbs.onStop();
          return { ready: angular.noop };
        });

        vm.subscribe('test', angular.noop, {
          onStop: function() {
            expect(this).to.equal(vm);
            next();
          },

          onReady: function() {
            expect(this).to.equal(vm);
            next();
          },

          onStart: function() {
            expect(this).to.equal(vm);
            next();
          }
        });
      });

      it('should call onStart callback after Meteor.subscribe has been called', function(done) {
        var vm = scope.viewModel({});

        sinon.stub(Meteor, 'subscribe', function() {
          return { ready: angular.noop };
        });

        vm.subscribe('test', angular.noop, {
          onStart: function() {
            expect(Meteor.subscribe.called).to.be.true;
            done();
          }
        });
      });

      it('should digest once subscription function is invoked', function(done) {
        var next = _.after(2, done);
        var digest = scope.$digest.bind(scope);

        scope.subscribe('test', function() {
          scope.$digest = function() {
            digest();
            next();
          };

          return [];
        });
      });

      it('should digest once subscription callback is invoked', function(done) {
        var next = _.after(2, done);
        var digest = scope.$digest.bind(scope);

        sinon.stub(Meteor, 'subscribe', function(name, cb) {
          cb();
          return { ready: angular.noop };
        });

        scope.subscribe('test', angular.noop, function() {
          scope.$digest = function() {
            digest();
            next();
          };
        });
      });

      it('should digest once subscription callbacks are invoked', function(done) {
        var next = _.after(3, done);
        var digest = scope.$digest.bind(scope);

        sinon.stub(Meteor, 'subscribe', function(name, cbs) {
          scope.$digest = function() {
            digest();
            next();
          };

          cbs.onReady();
          cbs.onStop();
          return { ready: angular.noop };
        });

        scope.subscribe('test', angular.noop, {
          onReady: angular.noop,
          onStop: angular.noop
        });
      });

      describe('result convertion', function() {
        it('no params', function() {
          var subscription = { ready: angular.noop };
          var subscribe = sinon.stub(Meteor, 'subscribe').returns(subscription);
          scope.subscribe('test', function() { return []; });
          expect(subscribe.calledWith('test', sinon.match.func)).to.be.true;
        });

        it('no return value', function() {
          var subscription = { ready: angular.noop };
          var subscribe = sinon.stub(Meteor, 'subscribe').returns(subscription);
          scope.subscribe('test', function() {  });
          expect(subscribe.calledWith('test', sinon.match.func)).to.be.true;
        });

        it('one param', function() {
          var subscription = { ready: angular.noop };
          var subscribe = sinon.stub(Meteor, 'subscribe').returns(subscription);
          scope.subscribe('test', function() { return ['a']; });
          expect(subscribe.calledWith('test', 'a', sinon.match.func)).to.be.true;
        });

        it('more than one param', function() {
          var subscription = { ready: angular.noop };
          var subscribe = sinon.stub(Meteor, 'subscribe').returns(subscription);
          scope.subscribe('test', function() { return ['a', 'b', 10, 100]; });
          expect(subscribe.calledWith('test', 'a', 'b', 10, 100, sinon.match.func)).to.be.true;
        });
      });
    });

    describe('callMethod()',function() {
      var scope;

      beforeEach(function() {
        scope = $rootScope.$new();
      });

      afterEach(function() {
        scope.$destroy();
        Meteor.call.restore();
      });

      it('should call Meteor.call() and digest once called back', function(done) {
        var digest = scope.$digest;

        sinon.stub(Meteor, 'call', function(name, arg1, arg2, cb) {
          expect(name).to.equal('method');
          expect(arg1).to.equal('foo');
          expect(arg2).to.equal('bar');
          cb();
        });

        scope.$digest = function() {
         digest.apply(this, arguments);
         done();
        };

        scope.callMethod('method', 'foo', 'bar', angular.noop);
      });
    });

    describe('applyMethod()',function() {
      var scope;

      beforeEach(function() {
        scope = $rootScope.$new();
      });

      afterEach(function() {
        scope.$destroy();
        Meteor.apply.restore();
      });

      it('should call Meteor.apply() and digest once called back', function(done) {
        var digest = scope.$digest;

        sinon.stub(Meteor, 'apply', function(name, args, cb) {
          expect(name).to.equal('method');
          expect(args).to.deep.equal(['foo', 'bar']);
          cb();
        });

        scope.$digest = function() {
         digest.apply(this, arguments);
         done();
        };

        scope.applyMethod('method', ['foo', 'bar'], angular.noop);
      });
    });

    describe('$bindToContext()', function() {
      var scope;

      beforeEach(function() {
        scope = $rootScope.$new();
      });

      afterEach(function() {
        scope.$destroy();
      });

      it('should bind a function to scope and digest once invoked', function() {
        var fn = sinon.spy();
        scope.$digest = angular.noop;

        var boundFn = scope.$bindToContext(fn);
        boundFn(1, 2, 3);

        expect(fn.calledOnce).to.be.true;
        expect(fn.thisValues[0]).to.equal(scope);
        expect(fn.args[0]).to.deep.equal([1, 2, 3]);
      });

      it('should bind the function to a custom scope if specified', function() {
        var fn = sinon.spy();
        scope.$digest = angular.noop;

        var context = {};
        var boundFn = scope.$bindToContext(context, fn);
        boundFn(1, 2, 3);

        expect(fn.calledOnce).to.be.true;
        expect(fn.thisValues[0]).to.equal(context);
        expect(fn.args[0]).to.deep.equal([1, 2, 3]);
      });
    });
  });
});
