'use strict';

import {ChangeDetectorRef, IterableDiffers, bind} from 'angular2/angular2';
import {DefaultIterableDifferFactory, CollectionChangeRecord} from 'angular2/change_detection';
import {ObservableWrapper} from 'angular2/facade';
import {MongoCollectionObserver, AddChange, MoveChange, RemoveChange} from './mongo_cursor_observer';

export class MongoCollectionDifferFactory extends DefaultIterableDifferFactory {
  supports(obj: Object): boolean { return obj instanceof Mongo.Cursor; }

  create(cdRef: ChangeDetectorRef): MongoCollectionDiffer {
    return new MongoCollectionDiffer(cdRef);
  }
}

// TODO(barbatus): to implement IterableDiffer interface.
export class MongoCollectionDiffer {
  _inserted: Array<CollectionChangeRecord>;
  _removed: Array<CollectionChangeRecord>;
  _moved: Array<CollectionChangeRecord>;
  _observer: MongoCollectionObserver;
  _lastChanges: Array<AddChange|MoveChange|RemoveChange>;
  _listSize: Number;

  constructor(cdRef: ChangeDetectorRef) {
    this._inserted = [];
    this._removed = [];
    this._moved = [];
    this._lastChanges = null;
    this._observer = null;
    this._cursor = null;
    this._listSize = 0;
  }

  forEachAddedItem(fn: Function) {
    for (var i = 0; i < this._inserted.length; i++) {
      fn(this._inserted[i]);
    }
  }

  forEachMovedItem(fn: Function) {
    for (var i = 0; i < this._moved.length; i++) {
      fn(this._moved[i]);
    }
  }

  forEachRemovedItem(fn: Function) {
    for (var i = 0; i < this._removed.length; i++) {
      fn(this._removed[i]);
    }
  }

  diff(cursor: Mongo.Cursor<any>) {
    this._reset();

    if (cursor && this._cursor !== cursor) {
      this._destroyObserver();
      this._cursor = cursor;
      this._observer = new MongoCollectionObserver(this._cursor);
      var self = this;
      this._subscription = ObservableWrapper.subscribe(this._observer,
        changes => {
          self._updateLatestValue(changes);
        });
      this._lastChanges = this._observer.lastChanges;
    }

    if (this._lastChanges) {
      this._applyChanges(this._lastChanges);
      this._lastChanges = null;
      return this;
    }

    return null;
  }

  onDestroy() {
    this._destroyObserver();
  }

  _destroyObserver() {
    if (this._subscription) {
      ObservableWrapper.dispose(this._subscription);
    }
    if (this._observer) {
      this._observer.destroy();
    }

    this._applyCleanup();
    this._listSize = 0;
  }

  _updateLatestValue(changes) {
    this._lastChanges = changes;
  }

  _reset() {
    this._inserted.length = 0;
    this._moved.length = 0;
    this._removed.length = 0;
  }

  _applyCleanup() {
    for (var index = 0; index < this._listSize; index++) {
      this._removed.push(this._createChangeRecord(
        null, index, null));
    }
  }

  _applyChanges(changes) {
    for (var i = 0; i < changes.length; i++) {
      if (changes[i] instanceof AddChange) {
        this._inserted.push(this._createChangeRecord(
          changes[i].index, null, changes[i].item));
        this._listSize++;
      }
      if (changes[i] instanceof MoveChange) {
        this._moved.push(this._createChangeRecord(
          changes[i].toIndex, changes[i].fromIndex, changes[i].item));
      }
      if (changes[i] instanceof RemoveChange) {
        this._removed.push(this._createChangeRecord(
          null, changes[i].index, changes[i].item));
        this._listSize--;
      }
    }
  }

  _createChangeRecord(currentIndex, prevIndex, item) {
    var record = new CollectionChangeRecord(item);
    record.currentIndex = currentIndex;
    record.previousIndex = prevIndex;
    return record;
  }
}
