'use strict';

import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {Match, check} from 'meteor/check';
import {EJSON} from 'meteor/ejson';

import {CursorHandle} from './cursor_handle';

export class AddChange {
  constructor(public index: number, public item: any) {}
}

export class UpdateChange {
  constructor(public index: number, public item: any) {}
}

export class MoveChange {
  constructor(public fromIndex: number, public toIndex: number) {}
}

export class RemoveChange {
  constructor(public index: number) {}
}

export class Subscription {
  private _isUnsubscribed: boolean = false;

  constructor(private _next: Function,
              private _error: Function,
              private _complete: Function) { }

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

declare interface MongoItem {
  _id: EJSONable;
}

export class MongoCursorObserver {
  private _docs: Array<MongoItem> = [];
  private _added: Array<AddChange> = [];
  private _lastChanges: Array<MongoDocChange> = [];
  private _hCursor: CursorHandle;
  private _subs: Array<Subscription> = [];
  private _isSubscribed: boolean = false;

  static isCursor(cursor: any): boolean {
    return cursor && !!cursor.observe;
  }

  constructor(cursor: Mongo.Cursor<any>) {
    check(cursor, Match.Where(MongoCursorObserver.isCursor));

    this._hCursor = this._startCursor(cursor);
  }

  get lastChanges() {
    return this._lastChanges;
  }

  /**
   * Subcribes to the Mongo cursor changes.
   *
   * Since it's possible that some changes that been already collected
   * before the moment someone subscribes to the observer,
   * we emit these changes, but only to the first ever subscriber.
   */
  subscribe({next, error, complete}) {
    let subscription = new Subscription(next, error, complete);
    this._subs.push(subscription);

    // If no subscriber has subscribed ever. 
    if (!this._isSubscribed) {
      this._isSubscribed = true;

      if (this._added.length) {
        this.emit(this._added.splice(0));
      }
    }

    return subscription;
  }

  emit(value) {
    if (this._subs) {
      for (let sub of this._subs) {
        sub.onNext(value);
      }
    }
  }

  _startCursor(cursor: Mongo.Cursor<any>): CursorHandle {
    let hCurObserver = this._startCursorObserver(cursor);
    return new CursorHandle(hCurObserver);
  }

  _startCursorObserver(cursor: Mongo.Cursor<any>): Meteor.LiveQueryHandle {
    let self = this;
    return cursor.observe({
      addedAt: function(doc, index) {
        let change = self._addAt(doc, index);
        self.emit([change]);
      },

      changedAt: function(nDoc, oDoc, index) {
        let doc = self._docs[index];
        let mDoc = <MongoItem>nDoc;
        if (EJSON.equals(doc._id, mDoc._id)) {
          Object.assign(self._docs[index], mDoc);
        } else {
          self._docs[index] = mDoc;
        }
        let change = self._updateAt(self._docs[index], index);
        self.emit([change]);
      },

      movedTo: function(doc, fromIndex, toIndex) {
        let change = self._moveTo(doc, fromIndex, toIndex);
        self.emit([change]);
      },

      removedAt: function(doc, atIndex) {
        let change = self._removeAt(atIndex);
        self.emit([change]);
      }
    });
  }

  _updateAt(doc, index) {
    return new UpdateChange(index, doc);
  }

  _addAt(doc, index) {
    this._docs.splice(index, 0, doc);
    let change = new AddChange(index, doc);
    if (!this._isSubscribed) {
      this._added.push(change);
    }
    return change;
  }

  _moveTo(doc, fromIndex, toIndex) {
    this._docs.splice(fromIndex, 1);
    this._docs.splice(toIndex, 0, doc);
    return new MoveChange(fromIndex, toIndex);
  }

  _removeAt(index) {
    this._docs.splice(index, 1);
    return new RemoveChange(index);
  }

  destroy() {
    if (this._hCursor) {
      this._hCursor.stop();
    }

    this._hCursor = null;
    this._docs = null;
    this._added = null;
    this._subs = null;
  }
}
