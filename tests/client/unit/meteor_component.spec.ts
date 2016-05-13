import * as ngCore from '@angular/core';
import {MeteorComponent, PromiseQ} from 'angular2-meteor';
import {chai} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:sinon';

const should = chai.should();
const expect = chai.expect;

describe('MeteorComponent', function() {
  var component;
  var zoneSpy;

  beforeEach(function() {
    component = new MeteorComponent();
    PromiseQ.wrapPush = cb => cb;
  });

  describe('implements', function() {
    it('ngOnDestroy', function() {
      should.exist(component.ngOnDestroy);
    });
  });

  describe('subscribe', function() {
    var meteorSub;
    beforeEach(function() {
      meteorSub = sinon.stub(Meteor, 'subscribe');
    });

    afterEach(function() {
      Meteor.subscribe.restore();
    });

    it('should call Meteor.subscribe with the same args', function() {
      this.timeout(0);
      var callback = sinon.spy();
      var args = ['collection', 'foo', 'bar'];
      component.subscribe.apply(component, args.concat(callback));
      expect(meteorSub.calledOnce).to.equal(true);
      expect(_.initial(meteorSub.args[0])).to.deep.equal(args);

      _.last(meteorSub.args[0]).call();
      expect(callback.calledOnce).to.equal(true);
    });
  });
  
  describe('MeteorComponent.call', function() {
    this.timeout(0);
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
