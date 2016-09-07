'use strict';

import {Observable, Subscriber} from 'rxjs';

import {CursorHandle} from '../cursor_handle';

import {gZone} from '../utils';

export class ObservableCursor<T> extends Observable<T[]> {
  private _data: Array <T> = [];
  private _cursor: Mongo.Cursor<T>;
  private _hCursor: CursorHandle;
  private _observers: Subscriber<T[]>[] = [];

  static create<T>(cursor: Mongo.Cursor<T>): ObservableCursor<T> {
    return new ObservableCursor<T>(cursor);
  }

  constructor(cursor: Mongo.Cursor<T>) {
    super((observer: Subscriber<T[]>) => {
      this._observers.push(observer);

      if (!this._hCursor) {
        this._hCursor = new CursorHandle(
          this._observeCursor(cursor));
      }

      return () => {
        let index = this._observers.indexOf(observer);
        if (index !== -1) {
          this._observers.splice(index, 1);
        }
        if (!this._observers.length) {
          this.stop();
        }
      };
    });
    _.extend(this, _.omit(cursor, 'count', 'map'));
    this._cursor = cursor;
  }

  get cursor(): Mongo.Cursor<T> {
    return this._cursor;
  }

  stop() {
    if (this._hCursor) {
      this._hCursor.stop();
    }
    this._runComplete();
    this._hCursor = null;
  }

  dispose() {
    this._observers = null;
    this._cursor = null;
  }

  fetch(): Array<T> {
    return this._cursor.fetch();
  }

  observe(callbacks: Mongo.ObserveCallbacks): Meteor.LiveQueryHandle {
    return this._cursor.observe(callbacks);
  }

  observeChanges(callbacks: Mongo.ObserveChangesCallbacks): Meteor.LiveQueryHandle {
    return this._cursor.observeChanges(callbacks);
  }

  _runComplete() {
    this._observers.forEach(observer => {
      observer.complete();
    });
  }

  _runNext(data: Array<T>) {
    this._observers.forEach(observer => {
      observer.next(data);
    });
  }

  _addedAt(doc, at, before) {
    this._data.splice(at, 0, doc);
    this._handleChange();
  }

  _changedAt(doc, old, at) {
    this._data[at] = doc;
    this._handleChange();
  };

  _removedAt(doc, at) {
    this._data.splice(at, 1);
    this._handleChange();
  };

  _handleChange() {
    this._runNext(this._data);
  };

  _observeCursor(cursor: Mongo.Cursor<T>) {
    return gZone.run(
      () => cursor.observe({
        addedAt: this._addedAt.bind(this),
        changedAt: this._changedAt.bind(this),
        removedAt: this._removedAt.bind(this)
      }));
  }
}
