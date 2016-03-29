import * as ngCore from 'angular2/core';
import {MeteorComponent} from 'angular2-meteor';
import {chai} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:sinon';

const should = chai.should();
const expect = chai.expect;

describe('MeteorComponent', function() {
  var ngZone;
  var component;
  var zoneSpy;

  beforeEach(function() {
    ngZone = ngCore.createNgZone();
    zoneSpy = sinon.spy(ngZone, 'run');
    component = new MeteorComponent(ngZone);
  });

  afterEach(function() {
    ngZone.run.restore();
  });

  describe('implements', function() {
    it('ngOnDestroy', function() {
      should.exist(component.ngOnDestroy);
    });
  });

  describe('subscribe', function() {
    var meteorSub;
    beforeEach(function() {
      meteorSub = sinon.stub(Meteor, 'subscribe').returns({ stop: _.noop });
    });

    afterEach(function() {
      Meteor.subscribe.restore();
    });

    describe('with only name', function() {
      it('should call Meteor.subscribe with only name', function() {
        var args = ['collection'];
        component.subscribe.apply(component, args);
        expect(meteorSub.calledOnce).to.equal(true);
        expect(meteorSub.args[0]).to.deep.equal(args);
      });
    });

    describe('with args', function() {
      it('should call Meteor.subscribe with given name, args', function() {
        var args = ['collection', 'foo', 'bar'];
        component.subscribe.apply(component, args);
        expect(meteorSub.calledOnce).to.equal(true);
        expect(meteorSub.args[0]).to.deep.equal(args);
      });

      describe('and autoBind true', function() {
        it('should call Meteor.subscribe as usual', function() {
          var args = ['collection', 'foo', 'bar', true];
          component.subscribe.apply(component, args);
          expect(meteorSub.calledOnce).to.equal(true);
          expect(meteorSub.args[0]).to.deep.equal(args);
        });
      });
    });

    describe('with callback', function() {
      it('should call Meteor.subscribe with name, args and callback', function() {
        var callback = sinon.spy();
        var args = ['collection', 'foo', 'bar'];
        component.subscribe.apply(component, args.concat(callback));
        expect(meteorSub.calledOnce).to.equal(true);
        expect(_.initial(meteorSub.args[0])).to.deep.equal(args);

        _.last(meteorSub.args[0]).call();
        expect(callback.calledOnce).to.equal(true);
      });
    });

    describe('with Meteor callbacks object', function() {
      it('should call Meteor.subscribe with name, args and callbacks object', function() {
        var callbacks = {
          onReady: sinon.spy(),
          onStop: sinon.spy(),
          onError: sinon.spy()
        };

        var args = ['collection', 'foo', 'bar'];
        component.subscribe.apply(component, args.concat(callbacks));
        expect(meteorSub.calledOnce).to.equal(true);
        expect(_.initial(meteorSub.args[0])).to.deep.equal(args);

        var actualCallbacks = _.last(meteorSub.args[0]);
        actualCallbacks.onReady();
        actualCallbacks.onError();
        actualCallbacks.onStop();
        expect(callbacks.onReady.calledOnce).to.equal(true);
        expect(callbacks.onError.calledOnce).to.equal(true);
        expect(callbacks.onStop.calledOnce).to.equal(true);
      });
    });

    describe('with callback and autobind', function() {
      describe('autobind off', function() {
        it('should use callback as usual', function() {
          var callback = sinon.spy();
          var args = ['collection', 'foo', 'bar'];
          component.subscribe.apply(component, args.concat(callback, false));
          expect(meteorSub.calledOnce).to.equal(true);
          expect(_.initial(meteorSub.args[0])).to.deep.equal(args);

          _.last(meteorSub.args[0]).call();
          expect(callback.calledOnce).to.equal(true);
          expect(zoneSpy.calledOnce).to.equal(false);
        });
      });

      describe('autobind on', function() {
        it('should use callback with zone.run', function() {
          var callback = sinon.spy();
          var args = ['collection', 'foo', 'bar'];
          component.subscribe.apply(component, args.concat(callback, true));
          expect(meteorSub.calledOnce).to.equal(true);
          expect(_.initial(meteorSub.args[0])).to.deep.equal(args);

          _.last(meteorSub.args[0]).call();
           expect(callback.calledOnce).to.equal(true);
          expect(zoneSpy.calledOnce).to.equal(true);
        });
      });
    });

    describe('with callbacks objects and autobind', function() {
      describe('autobind off', function() {
        it('should use callbacks as usual', function() {
          var callbacks = {
            onReady: sinon.spy(),
            onStop: sinon.spy(),
            onError: sinon.spy()
          };

          var args = ['collection', 'foo', 'bar'];
          component.subscribe.apply(component, args.concat(callbacks, false));
          expect(meteorSub.calledOnce).to.equal(true);
          expect(_.initial(meteorSub.args[0])).to.deep.equal(args);

          var actualCallbacks = _.last(meteorSub.args[0]);
          actualCallbacks.onReady();
          actualCallbacks.onError();
          actualCallbacks.onStop();
          expect(callbacks.onReady.calledOnce).to.equal(true);
          expect(callbacks.onError.calledOnce).to.equal(true);
          expect(callbacks.onStop.calledOnce).to.equal(true);
          expect(zoneSpy.calledOnce).to.equal(false);
        });
      });

      describe('autobind on', function() {
        it('should use callbacks with zone.bind', function() {
          var callbacks = {
            onReady: sinon.spy(),
            onStop: sinon.spy(),
            onError: sinon.spy()
          };

          var args = ['collection', 'foo', 'bar'];
          component.subscribe.apply(component, args.concat(callbacks, true));
          expect(meteorSub.calledOnce).to.equal(true);
          expect(_.initial(meteorSub.args[0])).to.deep.equal(args);

          var actualCallbacks = _.last(meteorSub.args[0]);
          actualCallbacks.onReady();
          actualCallbacks.onError();
          actualCallbacks.onStop();
          expect(callbacks.onReady.calledOnce).to.equal(true);
          expect(callbacks.onError.calledOnce).to.equal(true);
          expect(callbacks.onStop.calledOnce).to.equal(true);
          expect(zoneSpy.callCount).to.equal(3);
        });
      });
    });
  });
  
  describe('MeteorComponent.call', function() {
    var meteorCall;
    beforeEach(function() {
      meteorCall = sinon.spy(Meteor, 'call');
    });

    afterEach(function() {
      Meteor.call.restore();
    });

    it('Meteor.call should be called with the same args', function() {
      var args = ['collection', 'foo1', 'foo2', true];
      component.call.apply(component, args);
      expect(meteorCall.calledOnce).to.equal(true);
      expect(meteorCall.args[0]).to.deep.equal(args);
    });

    it('the method callback should run in the zone if the autobind is true', function() {
      var callback = sinon.spy();
      var args = ['collection', 'foo1', 'foo2'];
      component.call.apply(component, args.concat(callback, true));
      expect(meteorCall.calledOnce).to.equal(true);
      expect(_.initial(meteorCall.args[0])).to.deep.equal(args);

      _.last(meteorCall.args[0]).call();
      expect(callback.calledOnce).to.equal(true);
      expect(zoneSpy.calledOnce).to.equal(true);
    });
  });
});
