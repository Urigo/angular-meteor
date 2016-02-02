import 'reflect-metadata';
import * as ngCore from 'angular2/core';
import {MongoCursorDiffer} from 'angular2-meteor/mongo_cursor_differ';
import {AddChange, RemoveChange, MoveChange} from 'angular2-meteor/mongo_cursor_observer';
import * as fakes from './lib/fakes';

describe('MongoCursorDiffer', function() {
  var fakeFactory;
  var fakeObserver;
  var fakeCursor;

  beforeEach(function() {
    fakeCursor = new fakes.MongoCollectionCursorFake();
    fakeObserver = new fakes.MongoCollectionObserverFake(fakeCursor);
    fakeFactory = new fakes.ObserverFactoryFake(fakeObserver);
  });

  it('should return null if no changes', function() {
    var differ = new MongoCursorDiffer(null /*cdRef*/, fakeFactory);
    expect(differ.diff()).toBe(null);
  });

  it('all collection changes are handled', function() {
    var differ = new MongoCursorDiffer(null /*cdRef*/, fakeFactory);
    differ.diff(fakeCursor);
    var changes = [
      new AddChange(5, {name: 'some doc'}),
      new RemoveChange(15),
      new MoveChange(10, 20)];
    fakeObserver.emit(changes);
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

  it('new cursor being handled properly', function() {
    var emptyFakeFactory = new fakes.ObserverFactoryFake();

    var differ = new MongoCursorDiffer(null /*cdRef*/, emptyFakeFactory);
    differ.diff(fakeCursor);
    var changes1 = [
      new AddChange(5, {name: 'cursor1 doc'})];
    // This is ideally should be done via the cursor.
    differ.observer.emit(changes1);
    differ.diff();

    var fakeCursor1 = new fakes.MongoCollectionCursorFake();
    differ.diff(fakeCursor1);
    var changes2 = [
      new AddChange(10, {name: 'cursor2 doc'})];
    differ.observer.emit(changes2);
    differ.diff();

    var forEachAddedItem = jasmine.createSpy().and.callFake(function(addChange) {
      expect(addChange.item).toEqual(changes2[0].item);
      expect(addChange.currentIndex).toEqual(changes2[0].index);
    });
    differ.forEachAddedItem(forEachAddedItem);
    expect(forEachAddedItem).toHaveBeenCalled();
  });
});
