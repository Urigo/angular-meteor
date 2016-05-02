'use strict';
var tracker_1 = require('meteor/tracker');
var check_1 = require('meteor/check');
var CursorHandle = (function () {
    function CursorHandle(hCurObserver, hAutoNotify) {
        check_1.check(hAutoNotify, check_1.Match.Optional(tracker_1.Tracker.Computation));
        check_1.check(hCurObserver, check_1.Match.Where(function (observer) {
            return !!observer.stop;
        }));
        this._hAutoNotify = hAutoNotify;
        this._hCurObserver = hCurObserver;
    }
    CursorHandle.prototype.stop = function () {
        if (this._hAutoNotify) {
            this._hAutoNotify.stop();
        }
        ;
        this._hCurObserver.stop();
    };
    return CursorHandle;
}());
exports.CursorHandle = CursorHandle;
