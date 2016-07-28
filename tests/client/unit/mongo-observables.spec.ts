import {MongoObservable} from 'angular2-meteor';
import {chai} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:sinon';
import {Observable} from "rxjs";

const expect = chai.expect;

describe('MongoObservable', function() {
  let collection, mongoCollection;

  before(function() {
    collection = new MongoObservable.Collection("test");
    mongoCollection = collection.getMongoCollection();
  });

  it ("Should return RxJS Observable object when using 'find'", function() {
    let findResult = collection.find({});
    expect(findResult instanceof Observable).to.equal(true);
  });
});
