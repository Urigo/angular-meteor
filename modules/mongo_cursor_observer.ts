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

declare type MongoDocChange = AddChange | MoveChange | UpdateChange | RemoveChange;

export class MongoCursorObserver {
  private _docs: Array<any> = [];
  private _changes: Array<MongoDocChange> = [];
  private _lastChanges: Array<MongoDocChange> = [];
  private _hCursor: CursorHandle;
  private _subs: Array<Subscription> = [];

  constructor(cursor: Mongo.Cursor<any>) {
    check(cursor, Mongo.Cursor);

    this._hCursor = this._startCursor(cursor);
  }

  get lastChanges() {
    return this._lastChanges;
  }

  subscribe({next, error, complete}) {
    let sub = new Subscription(next, error, complete);
    this._subs.push(sub);

    // Emit last preserved changes if any for every new subscriber.
    if (this.lastChanges.length) {
      this._emitWithSub(sub, this.lastChanges);
    }

    return sub;
  }

  emit(value) {
    if (this._subs) {
      for (let sub of this._subs) {
        sub.onNext(value);
      }
    }
  }

  _emitWithSub(sub: Subscription, changes: Array<MongoDocChange>) {
    sub.onNext(changes);
  }

  /**
   * Splits changes with the help of {@link _splitChanges},
   * and emits sequences of changes one by one.
   * For example, if passed changes are
   *
   * [AddChange, AddChange, RemoveChange, AddChange],
   *
   * the final emitting sequence will be
   *
   * [AddChange, AddChange], [RemoveChange], [AddChange].
   *
   * This is done to guarantee consistency.
   * Ng2 differ API doesn't provide way to apply difference changes consequently.
   * Changes can be applied by types only, i.e. first remove changes, then inserts etc,
   * which's what exactly done by the NgFor via a IterableDiffer instance.
   */
  _emitChanges(changes) {
    let splitChanges = this._splitChanges(changes);
    for (let changesOneType of splitChanges) {
      this.emit(changesOneType);
    }
  }

  /**
   * Splits passed changes into multiple subarrays.
   * One contigues sequence of changes is wrapped per array.
   * See {@link _emitChanges} for the explanation why.
   */
  _splitChanges(changes) {
    let splitChanges = [];
    let changeType = changes[0].constructor.name;
    let changesOneType = [];
    for (let change of changes) {
      if (changeType != change.constructor.name) {
        changeType = change.constructor.name;
        splitChanges.push(changesOneType);
        changesOneType = [];
      }
      changesOneType.push(change);
    }

    if (changesOneType.length) {
      splitChanges.push(changesOneType);
    }

    return splitChanges;
  }

  _startCursor(cursor: Mongo.Cursor<any>): CursorHandle {
    let hCurObserver = this._startCursorObserver(cursor);
    let hAutoNotify = this._startAutoChangesNotify(cursor);
    return new CursorHandle(cursor, hAutoNotify, hCurObserver);
  }

  _startAutoChangesNotify(cursor: Mongo.Cursor<any>): Tracker.Computation {
    return Tracker.autorun(() => {
      /** 
       * Fetch here to emit changes in bulk.
       * Even though changes are not emitted all together
       * (see {@link _emitChanges}),
       * its more optimal than applying change by change.
       */
      cursor.fetch();
      if (this._changes.length) {
        this._emitChanges(this._changes);
      }
      this._lastChanges = this._changes.splice(0);
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

    this._subs = null;
    this._hCursor = null;
    this._docs = null;
    this._changes = null;
  }
}
