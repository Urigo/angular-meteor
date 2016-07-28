import {MongoObservable} from 'angular2-meteor';
import {chai} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:sinon';
import * as fakes from "./lib/fakes";

const expect = chai.expect;

describe('MongoObservable methods bridge', function() {
  let collection, mongoCollection;
  let stub;

  beforeEach(function() {
    stub = sinon.stub(Mongo, "Collection", fakes.MongoCollectionFake);
    collection = new MongoObservable.Collection("test");
    mongoCollection = collection.getMongoCollection();
  });

  afterEach(function() {
    stub.restore();
  });

  function testOriginalMethod(methodName) {
    it("Should call the original '" + methodName + "' method of the Mongo.Collection", function() {
      let spy = sinon.spy(mongoCollection, methodName);
      collection[methodName]({});
      expect(spy.calledOnce).to.equal(true);
    });
  }

  testOriginalMethod("allow");
  testOriginalMethod("deny");
  testOriginalMethod("insert");
  testOriginalMethod("rawCollection");
  testOriginalMethod("rawDatabase");
  testOriginalMethod("remove");
  testOriginalMethod("update");
  testOriginalMethod("upsert");
  testOriginalMethod("find");
  testOriginalMethod("findOne");
});
