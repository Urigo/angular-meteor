'use strict';
var observable_cursor_1 = require('./observable-cursor');
function toObservable(cursor) {
    return observable_cursor_1.ObservableCursor.create(cursor);
}
exports.toObservable = toObservable;
