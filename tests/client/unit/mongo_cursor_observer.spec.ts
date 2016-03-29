import {MongoCursorObserver} from 'angular2-meteor';
import * as fakes from './lib/fakes';
import {chai} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:sinon';

const expect = chai.expect;

describe('MongoCursorObserver', function() {
  var fakeCursor;
  beforeEach(function() {
    fakeCursor = new fakes.MongoCollectionCursorFake();
  });

  it('start observing cursor', function() {
    let spy = sinon.spy(fakeCursor, 'observe');
    let observer = new MongoCursorObserver(fakeCursor);
    expect(spy.calledOnce).to.equal(true);
  });
});
