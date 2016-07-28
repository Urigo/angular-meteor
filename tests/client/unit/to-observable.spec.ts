import {toObservable} from 'angular2-meteor';
import {chai} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:sinon';
import {Observable} from "rxjs";

const expect = chai.expect;

describe('toObservable', function() {
  let collection : Mongo.Collection;
  let cursor : Mongo.Cursor;
  let observable : Observable;

  beforeEach(function() {
    collection = new Mongo.Collection(null);
    collection.allow({
      insert: function () {
        return true;
      },
      update: function () {
        return true;
      },
      remove: function () {
        return true;
      }
    });
    cursor = collection.find({});
    observable = toObservable(cursor);
  });

  it ("Should wrap the Mongo.Cursor and return RxJS Observable", function() {
    expect(observable instanceof Observable).to.equal(true);
  });

  it ("Should not use the actual Cursor 'observe' method without Observable subscription", function() {
    let spy = sinon.spy(cursor, "observe");
    expect(spy.called).to.equal(false);
    spy.restore();
  });

  it ("Should use the actual Cursor 'observe' after using Observable subscription", function() {
    let spy = sinon.spy(cursor, "observe");
    let subscriptionHandler = observable.subscribe(() => {});
    expect(spy.calledOnce).to.equal(true);
    spy.restore();
    subscriptionHandler.unsubscribe();
  });

  it ("Should not trigger subscription callback when creating the subscription", function() {
    let spy = sinon.spy();
    let subscriptionHandler = observable.subscribe(spy);
    expect(spy.called).to.equal(false);
    subscriptionHandler.unsubscribe();
  });

  it ("Should trigger subscription callback when adding data to the collection", function() {
    let spy = sinon.spy();
    let subscriptionHandler = observable.subscribe(spy);
    collection.insert({test: true});
    expect(spy.calledOnce).to.equal(true);
    subscriptionHandler.unsubscribe();
  });

  it ("Should trigger subscription callback when removing data to the collection", function() {
    let spy = sinon.spy();
    let subscriptionHandler = observable.subscribe(spy);

    let idToRemove = collection.insert({test: true});
    collection.remove(idToRemove);

    expect(spy.callCount).to.equal(2);
    subscriptionHandler.unsubscribe();
  });

  it ("Should trigger subscription callback when updating data on the collection", function() {
    let spy = sinon.spy();
    let subscriptionHandler = observable.subscribe(spy);

    let idToUpdate = collection.insert({test: true});
    collection.update({_id: idToUpdate}, {$set: {test: false}});

    expect(spy.callCount).to.equal(2);
    subscriptionHandler.unsubscribe();
  });

  it ("Should trigger the subscription callback multiple times when inserting multiple objects", function() {
    let spy = sinon.spy();
    let subscriptionHandler = observable.subscribe(spy);

    collection.insert({test: 1});
    collection.insert({test: 2});
    collection.insert({test: 3});

    expect(spy.callCount).to.equal(3);
    subscriptionHandler.unsubscribe();
  });

  it ("Should NOT trigger the subscription callback when trying to update non-existing object", function() {
    let spy = sinon.spy();
    let subscriptionHandler = observable.subscribe(spy);

    collection.insert({test: 1});
    collection.update({test: 'B'}, {$set: {test: 'C'}});

    expect(spy.callCount).to.equal(1);
    subscriptionHandler.unsubscribe();
  });

  it ("Should NOT trigger the subscription callback when trying to remove non-existing object", function() {
    let spy = sinon.spy();
    let subscriptionHandler = observable.subscribe(spy);

    collection.insert({test: 1});
    collection.remove({_id: "test"});

    expect(spy.callCount).to.equal(1);
    subscriptionHandler.unsubscribe();
  });

  it ("Should stop the observation of the Mongo.Collection when disposing the Observable", function() {
    let stopSpy = sinon.spy();
    let spy = sinon.stub(cursor, "observe", function() {
      return {
        stop: stopSpy
      }
    });

    let subscriptionHandler = observable.subscribe(function() {});
    subscriptionHandler.unsubscribe();

    expect(stopSpy.callCount).to.equal(1);
    spy.restore();
  });
});
