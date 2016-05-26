import * as ngCore from '@angular/core';
import {MeteorComponent, DataObserver, zoneRunScheduler} from 'angular2-meteor';
import {chai} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:sinon';

const should = chai.should();
const expect = chai.expect;

describe('MeteorComponent', function() {
  let component;
  let zoneSpy;

  beforeEach(function() {
    component = new MeteorComponent();
    sinon.stub(DataObserver, 'pushCb').returnsArg(0);
  });

  afterEach(() => {
    DataObserver.pushCb.restore();
  });

  describe('implements', function() {
    it('ngOnDestroy', function() {
      should.exist(component.ngOnDestroy);
    });
  });

  describe('subscribe', function() {
    let meteorSub;
    let zoneSpy;
    let gZone;
    beforeEach(function() {
      gZone = Zone.current;
      meteorSub = sinon.stub(Meteor, 'subscribe').yields();
      zoneSpy = sinon.spy(Zone.current, 'run');
    });

    afterEach(function() {
      meteorSub.restore();
      zoneSpy.restore();
    });

    it('should call Meteor.subscribe with the same args', () => {
      var callback = sinon.spy();
      var args = ['collection', 'foo', 'bar'];
      component.subscribe.apply(component, args.concat(callback));
      expect(meteorSub.calledOnce).to.equal(true);
      expect(_.initial(meteorSub.args[0])).to.deep.equal(args);

      expect(callback.calledOnce).to.equal(true);
    });

    it('if autoBind is false should call Meteor.subscribe in global zone', (done) => {
      var args = ['collection', () => {
        expect(gZone).to.equal(Zone.current);
        done();
      }, false];

      component.subscribe.apply(component, args);

      expect(zoneSpy.calledOnce).to.equal(true);
    });

    it('should call Meteor.subscribe in the current zone', (done) => {
      let ngZone = Zone.current.fork({ name: 'angular' });
      let ngZoneSpy = sinon.spy(ngZone, 'run');

      var args = ['collection', () => {
        expect(ngZone).to.equal(Zone.current);
        done();
      }];

      ngZone.run(() => {
        component.subscribe.apply(component, args);
      });

      expect(zoneSpy.calledOnce).to.equal(false);
    });
  });
  
  describe('MeteorComponent.call', function() {
    var meteorCall;
    beforeEach(function() {
      meteorCall = sinon.stub(Meteor, 'call');
    });

    afterEach(function() {
      Meteor.call.restore();
    });

    it('should call Meteor.call with the same args', function() {
      var callback = sinon.spy();
      var args = ['method', 'foo1', 'foo2'];
      component.call.apply(component, args.concat(callback));
      expect(meteorCall.calledOnce).to.equal(true);
      expect(_.initial(meteorCall.args[0])).to.deep.equal(args);

      _.last(meteorCall.args[0]).call();
      expect(callback.calledOnce).to.equal(true);
    });
  });
});
