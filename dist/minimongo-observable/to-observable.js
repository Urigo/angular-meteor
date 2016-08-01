"use strict";
var observable_cursor_1 = require('./observable-cursor');
var _ = require('lodash');
var COLLECTION_EVENTS_DEBOUNCE_TIMEFRAME = 100;
function toObservable(cursor) {
    var observable = observable_cursor_1.ObservableCursor.create(function (observer) {
        var rawHandleChange = function () { return Zone.current.run(function () { return observer.next(cursor.fetch()); }); };
        var handleChange = _.throttle(rawHandleChange, COLLECTION_EVENTS_DEBOUNCE_TIMEFRAME, { trailing: true });
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
