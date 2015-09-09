describe('MongoCursorObserver', function() {
  // TODO(barbatus): change to make use SystemJS with Jasmine
  // in a proper way.
  beforeAll(function(done) {
    System.import('angular2-meteor').then(function(ng2) {
      MongoCursorObserver = ng2.MongoCursorObserver;
      done();
    });
    spyOn(Meteor, 'setTimeout').and.callFake(function(func) {
      func();
    });
  });

  var fakeCursor;
  beforeEach(function() {
    fakeCursor = new MongoCollectionCursorFake();
  });

  it('start observing cursor', function() {
    spyOn(fakeCursor, 'observe').and.callThrough();
    var observer = new MongoCursorObserver(fakeCursor);
    expect(fakeCursor.observe).toHaveBeenCalled();
  });
});
