"use strict";
var observable_cursor_1 = require('./observable-cursor');
function toObservable(cursor) {
    var observable = observable_cursor_1.ObservableCursor.create(function (observer) {
        var handleChange = function () {
            observer.next(cursor.fetch());
        };
        var handler;
        var isReactive = observable.isReactive();
        observable._cursorRef = cursor;
        observable._reloadRef = handleChange;
        if (isReactive) {
            handler = cursor.observe({
                added: handleChange,
                changed: handleChange,
                removed: handleChange
            });
        }
        else {
            handleChange();
        }
        return function () {
            if (isReactive && handler && handler.stop) {
                handler.stop();
            }
        };
    });
    return observable;
}
exports.toObservable = toObservable;
