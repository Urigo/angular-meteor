"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var rxjs_1 = require('rxjs');
var ObservableCursor = (function (_super) {
    __extends(ObservableCursor, _super);
    function ObservableCursor(subscribe) {
        _super.call(this, subscribe);
        this._isReactive = true;
    }
    ObservableCursor.create = function (subscribe) {
        return new ObservableCursor(subscribe);
    };
    ObservableCursor.prototype.nonReactive = function () {
        this._isReactive = false;
        return this;
    };
    ObservableCursor.prototype.isReactive = function () {
        return this._isReactive;
    };
    ObservableCursor.prototype.getMongoCursor = function () {
        return this._cursorRef;
    };
    ObservableCursor.prototype.reload = function () {
        if (!this.isReactive() && this._reloadRef) {
            this._reloadRef();
            return this;
        }
        else {
            throw new Error("\"reload\" method only available when using non-reactive Observable Mongo.Cursor!");
        }
    };
    return ObservableCursor;
}(rxjs_1.Observable));
exports.ObservableCursor = ObservableCursor;
