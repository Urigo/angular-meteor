"use strict";
var Rx_1 = require("rxjs/Rx");
function toObservable(cursor) {
    return Rx_1.Observable.create(function (observer) {
        var handleChange = function () {
            observer.next(cursor.fetch());
        };
        var handler = cursor.observe({
            added: handleChange,
            changed: handleChange,
            removed: handleChange
        });
        return function () {
            handler.stop();
        };
    });
}
exports.toObservable = toObservable;
