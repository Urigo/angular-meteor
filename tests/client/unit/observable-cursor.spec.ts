import {ObservableCursor} from 'angular2-meteor';
import {chai} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:sinon';
import {Observable} from 'rxjs';

const expect = chai.expect;

describe('ObservableCursor', function () {
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
    observable = ObservableCursor.create(cursor);
  });

  it('Should wrap the Mongo.Cursor and return RxJS Observable', () => {
    expect(observable instanceof Observable).to.equal(true);
  });

  it('Should not use the actual Cursor "observeChanges" method w/o Observable subscription', () => {
    let spy = sinon.spy(cursor, 'observeChanges');
    expect(spy.called).to.equal(false);
    spy.restore();
  });

  it('Should use the actual Cursor "observeChanges" after using Observable subscription', () => {
    let spy = sinon.spy(cursor, 'observeChanges');
    let subHandler = observable.subscribe();
    expect(spy.calledOnce).to.equal(true);
    spy.restore();
    subHandler.unsubscribe();
  });

  it('Should not trigger subscription callback when creating the subscription', () => {
    let spy = sinon.spy();
    let subscriptionHandler = observable.subscribe(spy);
    expect(spy.called).to.equal(false);
    subscriptionHandler.unsubscribe();
  });

  it('Subscription should unsubscribe after the unsubscribe call', () => {
    let subHandler;
    let callback = () => {
      subHandler.unsubscribe();
    };
    let spy = sinon.spy(callback);
    subHandler = observable.subscribe(spy);
    collection.insert({});
    collection.insert({});
    expect(spy.calledOnce).to.be.true;
  });

  it('Should trigger subscription callback when adding data to the collection', () => {
    let newDoc = {name: 'newDoc'};
    let subHandler;
    let callback = docs => {
      let inserted = docs[0];
      expect(inserted.name).to.equal(newDoc.name);
      subHandler.unsubscribe();
    };
    let spy = sinon.spy(callback);
    subHandler = observable.subscribe(spy);
    collection.insert(newDoc);
    expect(spy.calledOnce).to.be.true;
  });

  it('Should trigger callback twice when inserting a doc and then removing it', () => {
    let count = 0;
    let subHandler;
    let callback = docs => {
      count++;
      if (count == 2) {
        expect(docs.length).to.equal(0);
        subHandler.unsubscribe();
      }
    };
    let spy = sinon.spy(callback);
    let subHandler = observable.subscribe(spy);
    let idToRemove = collection.insert({test: true});
    collection.remove(idToRemove);
    expect(spy.calledTwice).to.be.true;
  });

  it('Should subscription callback should have updated docs after updating', done => {
    let count = 0;
    let callback = docs => {
      count++;
      if (count == 1) {
        expect(docs[0].test).to.equal(true);
      }

      if (count == 2) {
        expect(docs[0].test).to.equal(false);
        subHandler.unsubscribe();
        done();
      }
    };
    let spy = sinon.spy(callback);

    let subHandler = observable.subscribe(spy);
    let idToUpdate = collection.insert({test: true});
    collection.update({_id: idToUpdate}, {$set: {test: false}});
    expect(spy.calledTwice).to.be.true;
  });

  it('Should stop the observation of the Mongo.Collection when disposing the Observable', () => {
    let stopSpy = sinon.spy();
    let spy = sinon.stub(cursor, 'observeChanges', () => {
      return {
        stop: stopSpy
      }
    });

    let subHandler = observable.subscribe();
    subHandler.unsubscribe();

    expect(stopSpy.callCount).to.equal(1);
    spy.restore();
  });
});
