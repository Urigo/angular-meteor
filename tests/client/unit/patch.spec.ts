import {createNgZone} from '@angular/core';
import {
  patchMeteorCall,
  patchMeteorSubscribe,
  patchTrackerAutorun,
  unpatchMeteor,
  patchMeteor,
  zoneRunScheduler
} from 'angular2-meteor';
import {chai} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:sinon';

const should = chai.should();
const expect = chai.expect;

describe('Meteor patching', function() {
  let gZone = global.Zone.current;
  let zoneSpy, autorunSpy, subscribeSpy, callSpy;


  beforeEach(function() {
    zoneSpy = sinon.spy(gZone, 'run');
    unpatchMeteor();
    autorunSpy = sinon.stub(Tracker, 'autorun');
    subscribeSpy = sinon.stub(Meteor, 'subscribe');
    callSpy = sinon.stub(Meteor, 'call');
    patchMeteor();
  });

  afterEach(function() {
    zoneSpy.restore();
  });

  describe('Tracker.autorun', function() {
    let trackerAutorun;
    beforeEach(function() {
      trackerAutorun = patchTrackerAutorun(function(...args) {
        args[args.length - 1]();
      });
    });

    it('original called', function() {
      let args = ['test'];
      Tracker.autorun.apply(null, args);
      expect(autorunSpy.calledOnce).to.equal(true);
      expect(autorunSpy.args[0]).to.deep.equal(args);
    });

    it('callback executed in global zone', function(done) {
      let callback = () => {
        expect(zoneSpy.calledOnce).to.equal(true);
        done();
      };
      trackerAutorun(callback);
    });

    it('calls to ngZone.run throttled', function(done) {
      let ngZone = gZone.fork({ name: 'angular' });
      let ngZoneSpy = sinon.spy(ngZone, 'run');
      let count = 0;
      function callback() {
        count++;
        if (count == 2) {
          zoneRunScheduler.onAfterRun(ngZone, () => {
            // Twice because of we run method in ngZone.run
            // and also one run for two calls of trackerAutorun,
            // which means throttling.
            expect(ngZoneSpy.calledTwice).to.equal(true);
            done();
          });
        }
      }

      ngZone.run(() => {
        trackerAutorun(callback);
        trackerAutorun(callback);
      });
    });
  });

  describe('Meteor.call', function() {
    let meteorCall;
    beforeEach(function() {
      meteorCall = patchMeteorCall(function(...args) {
        let param = args[args.length - 2];
        args[args.length - 1](param);
      });
    });

    it('original called', function() {
      let args = ['test'];
      Meteor.subscribe.apply(null, args);
      expect(subscribeSpy.calledOnce).to.equal(true);
      expect(subscribeSpy.args[0]).to.deep.equal(args);
    });

    it('callback executed in global zone', function(done) {
      let callback = (err) => {
        expect(zoneSpy.calledOnce).to.equal(true);
        expect(err).to.equal('err');
        done();
      };
      meteorCall('err', callback);
    });

    it('calls to ngZone.run throttled', function(done) {
      let ngZone = gZone.fork({ name: 'angular' });
      let ngZoneSpy = sinon.spy(ngZone, 'run');
      let count = 0;
      function callback() {
        count++;
        if (count == 2) {
          zoneRunScheduler.onAfterRun(ngZone, () => {
            expect(ngZoneSpy.calledTwice).to.equal(true);
            done();
          });
        }
      }

      ngZone.run(() => {
        meteorCall(callback);
        meteorCall(callback);
      });
    });
  });

  describe('Meteor.subscribe', function() {
    let meteorSubscribe;
    beforeEach(function() {
      meteorSubscribe = patchMeteorSubscribe(function(...args) {
        args[args.length - 1]();
      });
    });

    it('original called', function() {
      let args = ['test'];
      Meteor.call.apply(null, args);
      expect(callSpy.calledOnce).to.equal(true);
      expect(callSpy.args[0]).to.deep.equal(args);
    });

    it('callback executed in global zone', function(done) {
      let callback = () => {
        expect(zoneSpy.calledOnce).to.equal(true);
        done();
      };
      meteorSubscribe('sub', callback);
    });

    it('calls to ngZone.run throttled', function(done) {
      let ngZone = gZone.fork({ name: 'angular' });
      let ngZoneSpy = sinon.spy(ngZone, 'run');
      let count = 0;
      function callback() {
        count++;
        if (count == 2) {
          zoneRunScheduler.onAfterRun(ngZone, () => {
            expect(ngZoneSpy.calledTwice).to.equal(true);
            done();
          });
        }
      }

      ngZone.run(() => {
        meteorSubscribe('sub1', callback);
        meteorSubscribe('sub2', callback);
      });
    });
  });
});
