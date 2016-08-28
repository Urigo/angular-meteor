import {MongoObservable, ObservableCursor} from 'angular2-meteor';
import {chai} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:sinon';
import * as fakes from "./lib/fakes";

const expect = chai.expect;

describe('MongoObservable methods bridge', function() {
  let observable = new MongoObservable.Collection('test');
  let mongoCollection = observable.collection;

  it ('Should return RxJS Observable object when using "find"', function() {
    let findResult = observable.find({});
    expect(findResult instanceof ObservableCursor).to.equal(true);
  });

  function testOriginalMethod(methodName) {
    it(`Should call the original ${methodName} method of the Mongo.Collection`, () => {
      let stub = sinon.stub(mongoCollection, methodName);
      observable[methodName]({});
      expect(stub.calledOnce).to.equal(true);
    });
  }

  testOriginalMethod('allow');
  testOriginalMethod('deny');
  testOriginalMethod('insert');
  testOriginalMethod('rawCollection');
  testOriginalMethod('rawDatabase');
  testOriginalMethod('remove');
  testOriginalMethod('update');
  testOriginalMethod('upsert');
  testOriginalMethod('find');
  testOriginalMethod('findOne');
});
