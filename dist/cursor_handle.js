'use strict';
var utils_1 = require('./utils');
var CursorHandle = (function () {
    function CursorHandle(hCurObserver, hAutoNotify) {
        utils_1.check(hAutoNotify, Match.Optional(Tracker.Computation));
        utils_1.check(hCurObserver, Match.Where(function (observer) {
            return !!observer.stop;
        }));
        this._hAutoNotify = hAutoNotify;
        this._hCurObserver = hCurObserver;
    }
    CursorHandle.prototype.stop = function () {
        if (this._hAutoNotify) {
            this._hAutoNotify.stop();
        }
        this._hCurObserver.stop();
    };
    return CursorHandle;
}());
exports.CursorHandle = CursorHandle;
