describe('MongoCollectionObserver', function() {
  function ObserveHandleFake() {
    this.stop = function() {};
  }

  function MongoCollectionCursorFake() {
    this._generators = [];
    this.handle = new ObserveHandleFake();

    this.observe = function(generator) {
      this._generators.push(generator);
      return this.handle;
    };

    this.fetch = function() {};
  }

  // TODO(barbatus): change to make use SystemJS with Jasmine
  // in a proper way.
  beforeAll(function(done) {
    System.import('angular2-meteor').then(function(ng2) {
      MongoCollectionObserver = ng2.MongoCollectionObserver;
      done();
    });
  });

  var fakeCursor;
  beforeEach(function() {
    MongoCollectionCursorFake.prototype = Object.create(Mongo.Cursor.prototype);
    fakeCursor = new MongoCollectionCursorFake();
  });

  it('start observing cursor', function() {
    spyOn(fakeCursor, 'observe').and.callThrough();
    var observer = new MongoCollectionObserver(function() {
      return fakeCursor;
    });
    expect(fakeCursor.observe).toHaveBeenCalled();
  });

  it('reactive property defined', function() {
    var observer = new MongoCollectionObserver(function() {
      this.get('myproperty');
      return fakeCursor;
    });
    expect('myproperty' in observer).toBe(true);
  });

  it('reactive property is reactive', function(done) {
    spyOn(fakeCursor.handle, 'stop').and.callThrough();
    var cursorDef = jasmine.createSpy().and.callFake(function() {
      this.get('myproperty');
      return fakeCursor;
    });
    var observer = new MongoCollectionObserver(cursorDef);

    var callback = jasmine.createSpy().and.callFake(function() {
      expect(fakeCursor.handle.stop).toHaveBeenCalled();
      // 3 times - one to define gets, one on initial cursor init and
      // one on cursor change.
      expect(cursorDef.calls.count()).toEqual(3);
      done();
    });
    observer.on('newCursor', callback);

    // Assigns new value;
    observer.myproperty = 'new value';
  });

});
