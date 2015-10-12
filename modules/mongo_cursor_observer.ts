/// <reference path="../typings/angular2-meteor.d.ts" />

'use strict';

import {EventEmitter} from 'angular2/angular2';

import {CursorHandle} from './cursor_handle';

export class AddChange {
  index: number;
  item: any;

  constructor(index: number, item: any) {
    this.index = index;
    this.item = item;
  }
}

export class MoveChange {
  fromIndex: number;
  toIndex: number;

  constructor(fromIndex: number, toIndex: number) {
    this.fromIndex = fromIndex;
    this.toIndex = toIndex;
  }
}

export class RemoveChange {
  index: number;

  constructor(index: number) {
    this.index = index;
  }
}

export class MongoCursorObserver extends EventEmitter {
  _docs: Array<any> = [];
  _changes: Array<any> = [];
  _lastChanges: Array<any> = [];
  _cursorDefFunc: Function;
  _hCursor: CursorHandle;

  constructor(cursor: Mongo.Cursor<any>) {
    super();
    check(cursor, Mongo.Cursor);

    this._hCursor = this._startCursor(cursor);
  }

  get lastChanges() {
    return this._lastChanges;
  }

  _startCursor(cursor: Mongo.Cursor<any>): CursorHandle {
    var hCurObserver = this._startCursorObserver(cursor);
    var hAutoNotify = this._startAutoChangesNotify(cursor);
    return new CursorHandle(cursor, hAutoNotify, hCurObserver);
  }

  _startAutoChangesNotify(cursor: Mongo.Cursor<any>) {
    return Tracker.autorun(() => {
      cursor.fetch();
      let lastChanges = this._changes.splice(0);
      if (lastChanges.length) {
        this.next(lastChanges);
      }
      this._lastChanges = lastChanges;
    });
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

    this._hCursor = null;
    this._docs = null;
    this._changes = null;
  }
}
