import {MongoCursorObserver} from 'angular2-meteor/mongo_cursor_observer';
import * as fakes from './lib/fakes';

describe('MongoCursorObserver', function() {
  beforeAll(function() {
    spyOn(Meteor, 'setTimeout').and.callFake(function(func) {
      func();
    });
  });

  var fakeCursor;
  beforeEach(function() {
    fakeCursor = new fakes.MongoCollectionCursorFake();
  });

  it('start observing cursor', function() {
    spyOn(fakeCursor, 'observe').and.callThrough();
    var observer = new MongoCursorObserver(fakeCursor);
    expect(fakeCursor.observe).toHaveBeenCalled();
  });
});
