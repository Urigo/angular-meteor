'use strict';

import {EventEmitter} from 'angular2/angular2';

import {CursorHandle} from './cursor_handle';

export class AddChange {
  constructor(index: number, item: any) {
    check(index, Number);

    this.index = index;
    this.item = item;
  }
}

export class MoveChange {
  constructor(fromIndex: number, toIndex: number) {
    check(fromIndex, Number);
    check(toIndex, Number);

    this.fromIndex = fromIndex;
    this.toIndex = toIndex;
  }
}

export class RemoveChange {
  constructor(index: number) {
    check(index, Number);

    this.index = index;
  }
}

export class MongoCollectionObserver extends EventEmitter {
  _docs: Array<any>;
  _changes: Array<any>;
  _lastChanges: Array<any>;
  _cursorDefFunc: Function;
  _hCursor: CursorHandle;

  constructor(cursor: Mongo.Cursor<any>) {
    check(cursor, Mongo.Cursor);

    super();
    this._docs = [];
    this._changes = [];
    this._lastChanges = [];

    Meteor.setTimeout(() => {
      this._hCursor = this._startCursor(cursor);
    });
  }

  get lastChanges() {
    return this._lastChanges;
  }

  _startCursor(cursor: Mongo.Cursor<any>) {
    var hCurObserver = this._startCursorObserver(cursor);
    var hAutoNotify = this._startAutoChangesNotify(cursor);
    return new CursorHandle(cursor, hAutoNotify, hCurObserver);
  }

  _startAutoChangesNotify(cursor: Mongo.Cursor<any>) {
    return Tracker.autorun(zone.bind(() => {
      cursor.fetch();
      var lastChanges = this._changes.splice(0);
      if (lastChanges.length) {
        this.next(lastChanges);
      }
      this._lastChanges = lastChanges;
    }));
  }

  _startCursorObserver(cursor: Mongo.Cursor<any>) {
    var self = this;
    return cursor.observe({
      addedAt: function(doc, index) {
        self._addAt(doc, index);
      },

      changedAt: function(nDoc, oDoc, index) {
        var doc = self._docs[index];
        if (doc._id === nDoc._id) {
          Object.assign(self._docs[index], nDoc);
        } else {
          self._docs[index] = nDoc;
        }
      },

      movedTo: function(doc, fromIndex, toIndex) {
        self._moveTo(doc, fromIndex, toIndex);
      },

      removedAt: function(doc, atIndex) {
        self._removeAt(atIndex);
      }
    });
  }

  _addAt(doc, index) {
    this._docs.splice(index, 0, doc);
    this._changes.push(new AddChange(index, doc));
  }

  _moveTo(doc, fromIndex, toIndex) {
    this._docs.splice(fromIndex, 1);
    this._docs.splice(toIndex, 0, doc);
    this._changes.push(new MoveChange(fromIndex, toIndex));
  }

  _removeAt(index) {
    this._docs.splice(index, 1);
    this._changes.push(new RemoveChange(index));
  }

  destroy() {
    if (this._hCursor) {
      this._hCursor.stop();
    }
    this._docs.length = 0;
    this._changes.length = 0;

    this._hCursor = null;
    this._docs = null;
    this._changes = null;
  }
}
