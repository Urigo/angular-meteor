'use strict';

import {EventEmitter} from '@angular/core';

import {noop} from '@angular/core/src/facade/lang';

import {CursorHandle} from './cursor_handle';

import {EJSON, check, gZone, g, debounce} from './utils';

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

export declare type MongoDocChange =
  AddChange | MoveChange | UpdateChange | RemoveChange;

declare interface MongoItem {
  _id: EJSONable;
}

/**
 * Class that does a background work of observing
 * Mongo collection changes (through a cursor)
 * and notifying subscribers about them.
 */
export class MongoCursorObserver extends EventEmitter<MongoDocChange[]> {
  private _added: Array<AddChange> = [];
  private _lastChanges: Array<MongoDocChange> = [];
  private _cursor: Mongo.Cursor<any>;
  private _hCursor: CursorHandle;
  private _ngZone = g.Zone.current;
  private _isSubscribed = false;

  static isCursor(cursor: any): boolean {
    return cursor && !!cursor.observe;
  }

  constructor(cursor: Mongo.Cursor<any>,
              private _debounceMs: number = 50) {
    super();
    check(cursor, Match.Where(MongoCursorObserver.isCursor));

    this._cursor = cursor;
  }

  subscribe(events) {
    let sub = super.subscribe(events);

    // Start processing of the cursor lazily.
    if (!this._isSubscribed) {
      this._isSubscribed = true;
      this._hCursor = this._processCursor(this._cursor);
    }

    return sub;
  }

  get lastChanges() {
    return this._lastChanges;
  }

  destroy() {
    if (this._hCursor) {
      this._hCursor.stop();
    }

    this._hCursor = null;
  }

  private _processCursor(cursor: Mongo.Cursor<any>): CursorHandle {
    // On the server side fetch data, don't observe.
    if (Meteor.isServer) {
      let changes = [];
      let index = 0;
      for (let doc of cursor.fetch()) {
        changes.push(this._addAt(doc, index++));
      }
      this.emit(changes);
      return null;
    }

    let hCurObserver = this._startCursorObserver(cursor);
    return new CursorHandle(hCurObserver);
  }

  private _startCursorObserver(cursor: Mongo.Cursor<any>): Meteor.LiveQueryHandle {
    let changes = [];

    let callEmit = () => {
      this.emit(changes.slice());
      changes.length = 0;
    };

    // Since cursor changes are now applied in bulk
    // (due to emit debouncing), scheduling macro task
    // allows us to use MeteorApp.onStable,
    // i.e. to know when the app is stable.
    let scheduleEmit = () => {
      return this._ngZone.scheduleMacroTask('emit',
        callEmit, null, noop);
    };

    let init = false;
    let runTask = task => {
      task.invoke();
      this._ngZone.run(noop);
      init = true;
    };

    let emit = null;
    if (this._debounceMs) {
      emit = debounce(task => runTask(task), this._debounceMs, scheduleEmit);
    } else {
      let initAdd = debounce(task => runTask(task), 0, scheduleEmit);
      emit = () => {
        // This is for the case when cursor.observe
        // is called multiple times in a row
        // when the initial docs are being added.
        if (!init) {
          initAdd();
          return;
        }
        runTask(scheduleEmit());
      }
    }

    return gZone.run(() => cursor.observe({
      addedAt: (doc, index) => {
        let change = this._addAt(doc, index);
        changes.push(change);
        emit();
      },

      changedAt: (nDoc, oDoc, index) => {
        let change = this._updateAt(nDoc, index);
        changes.push(change);
        emit();
      },

      movedTo: (doc, fromIndex, toIndex) => {
        let change = this._moveTo(doc, fromIndex, toIndex);
        changes.push(change);
        emit();
      },

      removedAt: (doc, atIndex) => {
        let change = this._removeAt(atIndex);
        changes.push(change);
        emit();
      }
    }));
  }

  private _updateAt(doc, index) {
    return new UpdateChange(index, doc);
  }

  private _addAt(doc, index) {
    let change = new AddChange(index, doc);
    return change;
  }

  private _moveTo(doc, fromIndex, toIndex) {
    return new MoveChange(fromIndex, toIndex);
  }

  private _removeAt(index) {
    return new RemoveChange(index);
  }
}
