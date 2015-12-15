/// <reference path="../typings/angular2-meteor.d.ts" />

'use strict';

import {EventEmitter} from 'angular2/core';

import {CursorHandle} from './cursor_handle';

export class AddChange {
  constructor(public index: number, public item: any) {}
}

export class UpdateChange {
  constructor(public index: number, public item: any) { }
}

export class MoveChange {
  constructor(public fromIndex: number, public toIndex: number) {}
}

export class RemoveChange {
  constructor(public index: number) {}
}

class Subscription {
  private _isUnsubscribed: boolean = false;

  constructor(private _next: Function,
              private _error: Function,
              private _complete: Function) {}

  onNext(value) {
    if (!this._isUnsubscribed && this._next) {
      this._next(value);
    }
  }

  unsubscribe() {
    this._isUnsubscribed = true;
  }
}

export class MongoCursorObserver {
  private _docs: Array<any> = [];
  private _changes: Array<any> = [];
  private _lastChanges: Array<any> = [];
  private _hCursor: CursorHandle;
  private _subscriptions: Array<Subscription> = [];

  constructor(cursor: Mongo.Cursor<any>) {
    check(cursor, Mongo.Cursor);

    this._hCursor = this._startCursor(cursor);
  }

  get lastChanges() {
    return this._lastChanges;
  }

  subscribe({next, error, complete}) {
    let subscription = new Subscription(next, error, complete);
    this._subscriptions.push(subscription);
    return subscription;
  }

  emit(value) {
    if (this._subscriptions) {
      for (let sub of this._subscriptions) {
        sub.onNext(value);
      }
    }
  }

  _startCursor(cursor: Mongo.Cursor<any>): CursorHandle {
    let hCurObserver = this._startCursorObserver(cursor);
    let hAutoNotify = this._startAutoChangesNotify(cursor);
    return new CursorHandle(cursor, hAutoNotify, hCurObserver);
  }

  _startAutoChangesNotify(cursor: Mongo.Cursor<any>): Tracker.Computation {
    return Tracker.autorun(() => {
      cursor.fetch();
      let lastChanges = this._changes.splice(0);
      if (lastChanges.length) {
        this.emit(lastChanges);
      }
      this._lastChanges = lastChanges;
    });
  }

  _startCursorObserver(cursor: Mongo.Cursor<any>): Meteor.LiveQueryHandle {
    let self = this;
    return cursor.observe({
      addedAt: function(doc, index) {
        self._addAt(doc, index);
      },

      changedAt: function(nDoc, oDoc, index) {
        let doc = self._docs[index];
        if (EJSON.equals(doc._id, nDoc._id)) {
          Object.assign(self._docs[index], nDoc);
        } else {
          self._docs[index] = nDoc;
        }
        self._updateAt(self._docs[index], index);
      },

      movedTo: function(doc, fromIndex, toIndex) {
        self._moveTo(doc, fromIndex, toIndex);
      },

      removedAt: function(doc, atIndex) {
        self._removeAt(atIndex);
      }
    });
  }

  _updateAt(doc, index) {
    this._changes.push(new UpdateChange(index, doc));
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

    this._subscriptions = null;
    this._hCursor = null;
    this._docs = null;
    this._changes = null;
  }
}
