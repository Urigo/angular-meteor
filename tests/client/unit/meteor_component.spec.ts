import * as ngCore from '@angular/core';
import {MeteorReactive, zoneRunScheduler} from 'angular2-meteor';
import {chai} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:sinon';

const should = chai.should();
const expect = chai.expect;

describe('MeteorReactive', function() {
  let component;
  let zoneSpy;
  let gZone = Zone.current;

  beforeEach(function() {
    component = new MeteorReactive();
    zoneSpy = sinon.spy(Zone.current, 'run');
  });

  afterEach(() => {
    zoneSpy.restore();
  });

  describe('implements', function() {
    it('ngOnDestroy', function() {
      should.exist(component.ngOnDestroy);
    });
  });

  describe('MeteorReactive.autorun', () => {
    let autorunStub;
    beforeEach(function() {
      autorunStub = sinon.stub(Meteor, 'autorun');
    });

    afterEach(function() {
      autorunStub.restore();
    });

    describe('testing zone', () => {
      let ngZone, ngZoneSpy;

      beforeEach(function() {
        ngZone = Zone.current.fork({ name: 'angular' });
        ngZoneSpy = sinon.spy(ngZone, 'run');
      });

      afterEach(function() {
        ngZoneSpy.restore();
      });

      it('should run Angular 2 zone after the Meteor.autorun callback', (done) => {
        autorunStub = autorunStub.yields();

        let callback = sinon.spy();
        let args = [callback];

        ngZone.run(() => {
          component = new MeteorReactive();
          component.autorun(...args);
        });

        zoneRunScheduler.onAfterRun(ngZone, () => {
          expect(ngZoneSpy.calledTwice).to.be.true;
          expect(callback.calledOnce).to.be.true;
          done();
        });
      });
    });
  });

  describe('MeteorReactive.subscribe', () => {
    let meteorSub;
    beforeEach(function() {
      meteorSub = sinon.stub(Meteor, 'subscribe');
    });

    afterEach(function() {
      meteorSub.restore();
    });

    describe('testing params', () => {
      it('should call Meteor.subscribe with the same args', () => {
        // This makes the stub call last parameter automatically.
        meteorSub = meteorSub.yields();
        let callback = sinon.spy();
        let args = ['collection', 'foo', 'bar'];
        component.subscribe(...args.concat(callback));
        expect(meteorSub.calledOnce).to.be.true;
        expect(meteorSub.args[0].slice(0, -1)).to.deep.equal(args);

        expect(callback.calledOnce).to.be.true;
      });

      it('should call onReady if provided', done => {
        let args = ['collection', { onReady: () => done() }];
        component.subscribe(...args);
        meteorSub.args[0][1].onReady();
      });
    });

    describe('testing zone', () => {
      let ngZone, ngZoneSpy;

      beforeEach(function() {
        ngZone = Zone.current.fork({ name: 'angular' });
        ngZoneSpy = sinon.spy(ngZone, 'run');
      });

      afterEach(function() {
        ngZoneSpy.restore();
      });

      it('should call Meteor.subscribe callback in the global zone', (done) => {
        meteorSub = meteorSub.yields();
        let args = ['collection', () => {
          expect(gZone).to.equal(Zone.current);
          done();
        }];

        ngZone.run(() => {
          component = new MeteorReactive();
          component.subscribe(...args);
        });
      });

      it('should run Angular 2 zone after the Meteor.subscribe callback', (done) => {
        meteorSub = meteorSub.yields();

        let callback = sinon.spy();
        let args = ['collection', callback];

        ngZone.run(() => {
          component = new MeteorReactive();
          component.subscribe(...args);
        });

        zoneRunScheduler.onAfterRun(ngZone, () => {
          expect(ngZoneSpy.calledTwice).to.be.true;
          expect(callback.calledOnce).to.be.true;
          done();
        });
      });
    });
  });
  
  describe('MeteorReactive.call', () => {
    let meteorCall;
    beforeEach(function() {
      meteorCall = sinon.stub(Meteor, 'call');
    });

    afterEach(function() {
      Meteor.call.restore();
    });

    describe('testing params', () => {
      it('should call Meteor.call with the same args', function() {
        let callback = sinon.spy();
        let args = ['method', 'foo1', 'foo2', callback];
        component.call(...args.concat(callback));
        expect(meteorCall.calledOnce).to.be.true;
        expect(meteorCall.args[0].slice(0, -1)).to.deep.equal(args);

        _.last(meteorCall.args[0]).call();
        expect(callback.calledOnce).to.be.true;
      });

      it('should call onReady if provided', done => {
        let args = ['method', { onReady: () => done() }];
        component.call(...args);
        meteorCall.args[0][1].onReady();
      });
    });

    describe('testing zone', () => {
      let ngZone, ngZoneSpy;

      beforeEach(function() {
        ngZone = Zone.current.fork({ name: 'angular' });
        ngZoneSpy = sinon.spy(ngZone, 'run');
      });

      afterEach(function() {
        ngZoneSpy.restore();
      });

      it('should call Meteor.call callback in the global zone', (done) => {
        meteorCall = meteorCall.yields();
        let args = ['method', () => {
          expect(gZone).to.equal(Zone.current);
          done();
        }];

        ngZone.run(() => {
          component = new MeteorReactive();
          component.call(...args);
        });
      });

      it('Angular 2 zone runs should be debounced', (done) => {
        meteorCall = meteorCall.yields();

        let callback = sinon.spy();
        let args = ['method', callback];

        ngZone.run(() => {
          component = new MeteorReactive();
          component.call(...args);
          component.call(...args);
        });

        zoneRunScheduler.onAfterRun(ngZone, () => {
          expect(ngZoneSpy.calledTwice).to.be.true;
          expect(callback.calledTwice).to.be.true;
          done();
        });
      });
    });
  });
});
