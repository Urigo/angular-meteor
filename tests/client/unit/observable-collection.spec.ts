import {MongoObservable, ObservableCursor} from 'angular2-meteor';
import {chai} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:sinon';
import * as fakes from "./lib/fakes";

const expect = chai.expect;

describe('MongoObservable methods bridge', () => {
  let observable = new MongoObservable.Collection(null);
  let mongoCollection = observable.collection;

  it('Should return RxJS Observable object when using "find"', () => {
    let findResult = observable.find({});
    expect(findResult instanceof ObservableCursor).to.equal(true);
  });

  it('Insert should return an observable', done => {
    observable.insert({}).subscribe(id => {
      expect(id).to.be.string;
      done();
    });
  });

  it('Remove should return an observable', done => {
    observable.insert({}).subscribe(id => {
      observable.remove(id).subscribe(() => {
        done();
      });
    });
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
