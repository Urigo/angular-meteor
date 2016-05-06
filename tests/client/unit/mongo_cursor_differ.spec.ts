import * as ngCore from '@angular/core';
import {MongoCursorDifferFactory, MongoCursorDiffer} from 'angular2-meteor';
import {AddChange, RemoveChange, MoveChange} from 'angular2-meteor';
import * as fakes from './lib/fakes';
import {chai} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:sinon';

const expect = chai.expect;

describe('MongoCursorDiffer', function() {
  var fakeFactory;
  var fakeObserver;
  var fakeCursor;

  beforeEach(function() {
    fakeCursor = new fakes.MongoCollectionCursorFake();
    fakeObserver = new fakes.MongoCollectionObserverFake();
    fakeFactory = new fakes.ObserverFactoryFake(fakeObserver);
  });

  it('should return null if no changes', function() {
    var differ = new MongoCursorDiffer(null /*cdRef*/, fakeFactory);
    expect(differ.diff(null)).to.equal(null);
  });

  it('all collection changes are handled', function() {
    var differ = new MongoCursorDiffer(null /*cdRef*/, fakeFactory);
    differ.diff(fakeCursor);
    var changes = [
      new AddChange(5, {name: 'some doc'}),
      new RemoveChange(15),
      new MoveChange(10, 20)];
    fakeObserver.emit(changes);
    differ.diff(null);

    var forEachAddedItem = sinon.spy(function(addChange) {
      expect(addChange.item).to.equal(changes[0].item);
      expect(addChange.currentIndex).to.equal(changes[0].index);
    });
    differ.forEachAddedItem(forEachAddedItem);
    expect(forEachAddedItem.calledOnce).to.equal(true);

    var forEachRemovedItem = sinon.spy(function(removeChange) {
      expect(removeChange.previousIndex).to.equal(changes[1].index);
    });
    differ.forEachRemovedItem(forEachRemovedItem);
    expect(forEachRemovedItem.calledOnce).to.equal(true);

    var forEachMovedItem = sinon.spy(function(moveChange) {
      expect(moveChange.previousIndex).to.equal(changes[2].fromIndex);
      expect(moveChange.currentIndex).to.equal(changes[2].toIndex);
    });
    differ.forEachMovedItem(forEachMovedItem);
    expect(forEachMovedItem.calledOnce).to.equal(true);
  });

  it('new cursor being handled properly', function() {
    var emptyFakeFactory = new fakes.ObserverFactoryFake(fakeObserver);

    var differ = new MongoCursorDiffer(null /*cdRef*/, emptyFakeFactory);
    differ.diff(fakeCursor);
    var changes1 = [
      new AddChange(5, {name: 'cursor1 doc'})];
    // This is ideally should be done via the cursor.
    differ.observer.emit(changes1);
    differ.diff(null);

    var fakeCursor1 = new fakes.MongoCollectionCursorFake();
    differ.diff(fakeCursor1);
    var changes2 = [
      new AddChange(10, {name: 'cursor2 doc'})];
    differ.observer.emit(changes2);
    differ.diff(null);

    var forEachAddedItem = sinon.spy(function(addChange) {
      expect(addChange.item).to.equal(changes2[0].item);
      expect(addChange.currentIndex).to.equal(changes2[0].index);
    });
    differ.forEachAddedItem(forEachAddedItem);
    expect(forEachAddedItem.calledOnce).to.equal(true);
  });

  it('factory should recognize Mongo.Cursor', function() {
    let factory = new MongoCursorDifferFactory();
    expect(factory.supports(fakeCursor)).to.equal(true);
  });
});
