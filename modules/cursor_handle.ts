/// <reference path="../typings/angular2-meteor.d.ts" />

'use strict';

export class CursorHandle {
  private _cursor: Mongo.Cursor<any>;
  private _hAutoNotify: Tracker.Computation;
  private _hCurObserver: Meteor.LiveQueryHandle;

  constructor(
      cursor: Mongo.Cursor<any>,
      hAutoNotify: Tracker.Computation,
      hCurObserver: Meteor.LiveQueryHandle) {

    check(cursor, Mongo.Cursor);
    check(hAutoNotify, Tracker.Computation);
    check(hCurObserver, Match.Where(function(observer) {
      return !!observer.stop;
    }));

    this._cursor = cursor;
    this._hAutoNotify = hAutoNotify;
    this._hCurObserver = hCurObserver;
  }

  stop() {
    this._hAutoNotify.stop();
    this._hCurObserver.stop();
  }
}
