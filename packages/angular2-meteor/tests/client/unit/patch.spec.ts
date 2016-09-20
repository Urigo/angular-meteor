import {createNgZone} from '@angular/core';
import {
  patchMeteorCall,
  patchMeteorSubscribe,
  patchTrackerAutorun,
  unpatchMeteor,
  patchMeteor,
  zoneRunScheduler,
  DataObserver
} from 'angular2-meteor';
import {chai} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:sinon';

const should = chai.should();
const expect = chai.expect;

describe('Meteor patching', () => {
  let subscribeSpy, callSpy, pushCb;

  beforeEach(() => {
    unpatchMeteor();
    subscribeSpy = sinon.stub(Meteor, 'subscribe');
    pushCb = sinon.spy(DataObserver, 'pushCb');
    callSpy = sinon.stub(Meteor, 'call');
    patchMeteor();
  });

  afterEach(() => {
    pushCb.restore();
    callSpy.restore();
    subscribeSpy.restore();
  });

  describe('Meteor.call', () => {
    it('original called', () => {
      let args = ['test'];
      Meteor.call(...args);
      expect(callSpy.calledOnce).to.be.true;
      expect(_.initial(callSpy.args[0])).to.deep.equal(args);
      callSpy.args[0][1]();
    });
  });

  describe('Meteor.subscribe', () => {
    it('should call the original', () => {
      let args = ['test'];
      Meteor.subscribe(...args);
      expect(subscribeSpy.calledOnce).to.be.true;
      expect(_.initial(subscribeSpy.args[0])).to.deep.equal(args);
      subscribeSpy.args[0][1]();
    });

    it('DataObserver should watch callback', () => {
      let args = ['test'];
      Meteor.subscribe(...args);
      expect(DataObserver.cbLen).to.equal(1);
      subscribeSpy.args[0][1]();
      expect(DataObserver.cbLen).to.equal(0);
    });
  });
});
