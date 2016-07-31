import {chai} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:sinon';
import {MeteorObservable, ObservableMeteorSubscription} from "angular2-meteor";
import {Observable} from "rxjs";

const expect = chai.expect;

describe('MeteorObservable', function () {
  describe("call", function() {

    it("Should return RxJS Observable when using 'call'", function() {
      let returnValue = MeteorObservable.call("testMethod");
      expect(returnValue instanceof Observable).to.equal(true);
    });

    it("Should NOT run the actual 'call' method without subscribing to the result", function() {
      let spy = sinon.spy(Meteor, "call");
      MeteorObservable.call("testMethod");
      expect(spy.called).to.equal(false);
      spy.restore();
    });

    it("Should run the actual 'call' method when subscribing to the result", function() {
      let spy = sinon.spy(Meteor, "call");
      let subscriptionHandler = MeteorObservable.call("testMethod").subscribe(function() {});
      expect(spy.calledOnce).to.equal(true);
      spy.restore();
      subscriptionHandler.unsubscribe();
    });

    it("Should trigger the RxJS Observable 'next' callback when got the server response", function(done) {
      let spy = sinon.spy();
      let subscriptionHandler = MeteorObservable.call("testMethod").subscribe((serverResponse) => {
        spy();
        expect(spy.callCount).to.equal(1);
        expect(serverResponse).to.equal("TEST_VALUE");
        subscriptionHandler.unsubscribe();
        done();
      });
    });

    it("Should trigger the RxJS Observable 'complete' callback when got the server response", function(done) {
      let spy = sinon.spy();
      let subscriptionHandler = MeteorObservable.call("testMethod").subscribe(function() {}, function() {}, () => {
        spy();
        expect(spy.callCount).to.equal(1);
        subscriptionHandler.unsubscribe();
        done();
      });
    });

    it("Should trigger the RxJS Observable 'error' callback when got the server error", function(done) {
      let spy = sinon.spy();
      let subscriptionHandler = MeteorObservable.call("NON_EXISTING_METHOD").subscribe(function() {}, (e) => {
        spy();
        expect(spy.callCount).to.equal(1);
        expect(e instanceof Meteor.Error).to.equal(true);
        subscriptionHandler.unsubscribe();
        done();
      });
    });
  });

  describe("subscribe", function() {
    it("Should return RxJS Observable when using 'subscribe'", function() {
      let returnValue = MeteorObservable.subscribe("test");
      expect(returnValue instanceof Observable).to.equal(true);
    });

    it("Should NOT run the actual 'subscribe' method without subscribing to the result", function() {
      let spy = sinon.spy(Meteor, "subscribe");
      MeteorObservable.subscribe("test");
      expect(spy.called).to.equal(false);
      spy.restore();
    });

    it("Should run the actual 'subscribe' method when subscribing to the result", function() {
      let spy = sinon.spy(Meteor, "subscribe");
      let subscriptionHandler = MeteorObservable.subscribe("test").subscribe(function() {});
      expect(spy.called).to.equal(true);
      spy.restore();
      subscriptionHandler.unsubscribe();
    });

    it("Should call RxJS Observable 'next' callback when subscription is ready", function(done) {
      let spy = sinon.spy();

      let subscriptionHandler = MeteorObservable.subscribe("test").subscribe(() => {
        spy();
        expect(spy.callCount).to.equal(1);
        subscriptionHandler.unsubscribe();
        done();
      });
    });

    it("Should stop the Meteor subscription when unsubscribing to the RxJS Observable", function(done) {
      function getSubscriptionsCount() {
        return Object.keys((<any>Meteor).default_connection._subscriptions).length;
      }

      let baseSubscriptionsCount = getSubscriptionsCount();

      let subscriptionHandler = MeteorObservable.subscribe("test").subscribe(() => {
        expect(getSubscriptionsCount()).to.equal(baseSubscriptionsCount + 1);
        subscriptionHandler.unsubscribe();
        expect(getSubscriptionsCount()).to.equal(baseSubscriptionsCount);
        done();
      });
    });


    it("Should stop the Meteor subscription when calling stop of the Observable", function(done) {
      function getSubscriptionsCount() {
        return Object.keys((<any>Meteor).default_connection._subscriptions).length;
      }

      let baseSubscriptionsCount = getSubscriptionsCount();

      let obs : ObservableMeteorSubscription<any> = MeteorObservable.subscribe("test");
      let subscriptionHandler = obs.subscribe(() => {
        expect(getSubscriptionsCount()).to.equal(baseSubscriptionsCount + 1);
        obs.stop();
        expect(getSubscriptionsCount()).to.equal(baseSubscriptionsCount);
        done();
      });
    });
  });
});
