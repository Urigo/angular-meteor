'use strict';

export class CursorHandle {
  _cursor: Mongo.Cursor<any>;
  _hAutoNotify: Tracker.Computation;
  _hCurObserver: Object;

  constructor(cursor: Mongo.Cursor<any>,
    hAutoNotify: Tracker.Computation,
    hCurObserver: Object) {
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
