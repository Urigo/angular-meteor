'use strict';

export class CursorHandle {
  private _cursor: Mongo.Cursor<any>;
  private _hAutoNotify: Tracker.Computation;
  private _hCurObserver: Meteor.LiveQueryHandle;

  constructor(
    cursor: Mongo.Cursor<any>,
    hCurObserver: Meteor.LiveQueryHandle,
    hAutoNotify?: Tracker.Computation) {

    check(cursor, Mongo.Cursor);
    check(hAutoNotify, Match.Optional(Tracker.Computation));
    check(hCurObserver, Match.Where(function(observer) {
      return !!observer.stop;
    }));

    this._cursor = cursor;
    this._hAutoNotify = hAutoNotify;
    this._hCurObserver = hCurObserver;
  }

  stop() {
    if (this._hAutoNotify) {
      this._hAutoNotify.stop()
    };
    this._hCurObserver.stop();
  }
}
