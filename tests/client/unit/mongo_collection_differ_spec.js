function MongoCollectionObserverFake() {
  this._generators = [];

  this.observer = function(generator) {
    this._generators.push(generator);
  };

  this.next = function(value) {
    for (var i = 0; i < this._generators.length; i++) {
      this._generators[i].next(value);
    }
  };

  this.clear = function() {
    this._generators.length = 0;
  };
}

describe('MongoCollectionDiffer', function() {
  // TODO(barbatus): change to make use SystemJS with Jasmine
  // in a proper way.
  beforeAll(function(done) {
    System.import('angular2-meteor').then(function(ng2) {
      MongoCollectionDiffer = ng2.MongoCollectionDiffer;
      AddChange = ng2.AddChange;
      RemoveChange = ng2.RemoveChange;
      MoveChange = ng2.MoveChange;
      done();
    });
  });

  var fakeObserver;
  beforeEach(function() {
    fakeObserver = new MongoCollectionObserverFake();
  });

  it('should return null if no changes', function() {
    var differ = new MongoCollectionDiffer();
    expect(differ.diff()).toBe(null);
  });

  it('all collection changes are handled', function() {
    var differ = new MongoCollectionDiffer();
    differ.diff(fakeObserver);
    var changes = [
      new AddChange(5, {name: 'some doc'}),
      new RemoveChange(15),
      new MoveChange(10, 20)];
    fakeObserver.next(changes);
    differ.diff();

    var forEachAddedItem = jasmine.createSpy().and.callFake(function(addChange) {
      expect(addChange.item).toEqual(changes[0].item);
      expect(addChange.currentIndex).toEqual(changes[0].index);
    });
    differ.forEachAddedItem(forEachAddedItem);
    expect(forEachAddedItem).toHaveBeenCalled();

    var forEachRemovedItem = jasmine.createSpy().and.callFake(function(removeChange) {
      expect(removeChange.previousIndex).toEqual(changes[1].index);
    });
    differ.forEachRemovedItem(forEachRemovedItem);
    expect(forEachRemovedItem).toHaveBeenCalled();

    var forEachMovedItem = jasmine.createSpy().and.callFake(function(moveChange) {
      expect(moveChange.previousIndex).toEqual(changes[2].fromIndex);
      expect(moveChange.currentIndex).toEqual(changes[2].toIndex);
    });
    differ.forEachMovedItem(forEachMovedItem);
    expect(forEachMovedItem).toHaveBeenCalled();
  });
});
