import {toObservable, ObservableCursor} from 'angular2-meteor';
import {chai} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:sinon';
import {Observable} from 'rxjs';

const expect = chai.expect;

describe('toObservable', function () {
  let collection: Mongo.Collection;
  let cursor: Mongo.Cursor;
  let observable: ObservableCursor;

  beforeEach(function () {
    collection = new Mongo.Collection(null);
    collection.allow({
      insert: function () {
        return true;
      },
      remove: function () {
        return true;
      },
      update: function () {
        return true;
      }
    });

    cursor = collection.find({});
    observable = toObservable(cursor);
  });

  it('Should wrap the Mongo.Cursor and return RxJS Observable', function () {
    expect(observable instanceof Observable).to.equal(true);
  });

  it('Should not use the actual Cursor "observe" method without Observable subscription', function () {
    let spy = sinon.spy(cursor, 'observe');
    expect(spy.called).to.equal(false);
    spy.restore();
  });

  it('Should use the actual Cursor "observe" after using Observable subscription', function () {
    let spy = sinon.spy(cursor, 'observe');
    let subscriptionHandler = observable.subscribe(() => {
    });
    expect(spy.calledOnce).to.equal(true);
    spy.restore();
    subscriptionHandler.unsubscribe();
  });

  it('Should not trigger subscription callback when creating the subscription', function () {
    let spy = sinon.spy();
    let subscriptionHandler = observable.subscribe(spy);
    expect(spy.called).to.equal(false);
    subscriptionHandler.unsubscribe();
  });

  it('Should trigger subscription callback when adding data to the collection', function (done) {
    let spy = sinon.spy();
    let subscriptionHandler = observable.subscribe(spy);
    collection.insert({test: true});

    setTimeout(() => {
      expect(spy.calledOnce).to.equal(true);
      subscriptionHandler.unsubscribe();
      done();
    }, 100);

  });

  it('Should trigger subscription callback when removing data to the collection', function (done) {
    let spy = sinon.spy();
    let subscriptionHandler = observable.subscribe(spy);
    let idToRemove = collection.insert({test: true});
    collection.remove(idToRemove);

    setTimeout(() => {
      expect(spy.callCount).to.equal(1);
      subscriptionHandler.unsubscribe();
      done();
    }, 100);
  });

  it('Should trigger subscription callback when updating data on the collection', function (done) {
    let spy = sinon.spy();
    let subscriptionHandler = observable.subscribe(spy);

    let idToUpdate = collection.insert({test: true});
    collection.update({_id: idToUpdate}, {$set: {test: false}});

    setTimeout(() => {
      expect(spy.callCount).to.equal(1);
      subscriptionHandler.unsubscribe();
      done();
    }, 100);
  });

  it('Should trigger the subscription callback multiple times when inserting multiple objects', function (done) {
    let spy = sinon.spy();
    let subscriptionHandler = observable.subscribe(spy);

    collection.insert({test: 1});
    collection.insert({test: 2});
    collection.insert({test: 3});

    setTimeout(() => {
      expect(spy.callCount).to.equal(1);
      subscriptionHandler.unsubscribe();
      done();
    }, 100);
  });

  it('Should NOT trigger the subscription callback when trying to update non-existing object', function (done) {
    let spy = sinon.spy();
    let subscriptionHandler = observable.subscribe(spy);

    collection.insert({test: 1});
    collection.update({test: 'B'}, {$set: {test: 'C'}});

    setTimeout(() => {
      expect(spy.callCount).to.equal(1);
      subscriptionHandler.unsubscribe();
      done();
    }, 100);
  });

  it('Should NOT trigger the subscription callback when trying to remove non-existing object', function (done) {
    let spy = sinon.spy();
    let subscriptionHandler = observable.subscribe(spy);

    collection.insert({test: 1});
    collection.remove({_id: 'test'});

    setTimeout(() => {
      expect(spy.callCount).to.equal(1);
      subscriptionHandler.unsubscribe();
      done();
    }, 100);
  });

  it('Should stop the observation of the Mongo.Collection when disposing the Observable', function () {
    let stopSpy = sinon.spy();
    let spy = sinon.stub(cursor, 'observe', function () {
      return {
        stop: stopSpy
      }
    });

    let subscriptionHandler = observable.subscribe(function () {});
    subscriptionHandler.unsubscribe();

    expect(stopSpy.callCount).to.equal(1);
    spy.restore();
  });

  it('Should NOT trigger subscription callback when adding data to the non-reactive collection', function (done) {
    let spy = sinon.spy();
    let observable2 = toObservable(cursor);
    let subscriptionHandler = observable2.nonReactive().subscribe(spy);
    collection.insert({test: true});
    collection.insert({test: true});

    setTimeout(() => {
      expect(spy.callCount).to.equal(1);
      subscriptionHandler.unsubscribe();
      done();
    }, 100);
  });

  it('Should isReactive return false when calling nonReactive', function () {
    let spy = sinon.spy();
    let observable2 = toObservable(cursor);
    let subscriptionHandler = observable2.nonReactive().subscribe(spy);
    expect(observable2.isReactive()).to.equal(false);
    subscriptionHandler.unsubscribe();
  });

  it('Should isReactive return true when not calling nonReactive', function () {
    let spy = sinon.spy();
    let observable2 = toObservable(cursor);
    let subscriptionHandler = observable2.subscribe(spy);
    expect(observable2.isReactive()).to.equal(true);
    subscriptionHandler.unsubscribe();
  });

  it('Should trigger subscription callback when adding data to the non-reactive collection and calling reload', function (done) {
    let spy = sinon.spy();
    let observable2 = toObservable(cursor);
    let subscriptionHandler = observable2.nonReactive().subscribe(spy);
    collection.insert({test: true});
    collection.insert({test: true});
    collection.insert({test: true});
    collection.insert({test: true});
    collection.insert({test: true});
    collection.insert({test: true});
    collection.insert({test: true});
    observable2.reload();

    setTimeout(() => {
      expect(spy.callCount).to.equal(1);
      subscriptionHandler.unsubscribe();
      done();
    }, 100);
  });
});