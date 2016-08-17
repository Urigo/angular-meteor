'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = require('@angular/core');
var lang_1 = require('@angular/core/src/facade/lang');
var cursor_handle_1 = require('./cursor_handle');
var utils_1 = require('./utils');
var AddChange = (function () {
    function AddChange(index, item) {
        this.index = index;
        this.item = item;
    }
    return AddChange;
}());
exports.AddChange = AddChange;
var UpdateChange = (function () {
    function UpdateChange(index, item) {
        this.index = index;
        this.item = item;
    }
    return UpdateChange;
}());
exports.UpdateChange = UpdateChange;
var MoveChange = (function () {
    function MoveChange(fromIndex, toIndex) {
        this.fromIndex = fromIndex;
        this.toIndex = toIndex;
    }
    return MoveChange;
}());
exports.MoveChange = MoveChange;
var RemoveChange = (function () {
    function RemoveChange(index) {
        this.index = index;
    }
    return RemoveChange;
}());
exports.RemoveChange = RemoveChange;
/**
 * Class that does a background work of observing
 * Mongo collection changes (through a cursor)
 * and notifying subscribers about them.
 */
var MongoCursorObserver = (function (_super) {
    __extends(MongoCursorObserver, _super);
    function MongoCursorObserver(cursor, _debounceMs) {
        if (_debounceMs === void 0) { _debounceMs = 50; }
        _super.call(this);
        this._debounceMs = _debounceMs;
        this._added = [];
        this._lastChanges = [];
        this._ngZone = utils_1.g.Zone.current;
        this._isSubscribed = false;
        utils_1.check(cursor, Match.Where(MongoCursorObserver.isCursor));
        this._cursor = cursor;
    }
    MongoCursorObserver.isCursor = function (cursor) {
        return cursor && !!cursor.observe;
    };
    MongoCursorObserver.prototype.subscribe = function (events) {
        var sub = _super.prototype.subscribe.call(this, events);
        // Start processing of the cursor lazily.
        if (!this._isSubscribed) {
            this._isSubscribed = true;
            this._hCursor = this._processCursor(this._cursor);
        }
        return sub;
    };
    Object.defineProperty(MongoCursorObserver.prototype, "lastChanges", {
        get: function () {
            return this._lastChanges;
        },
        enumerable: true,
        configurable: true
    });
    MongoCursorObserver.prototype.destroy = function () {
        if (this._hCursor) {
            this._hCursor.stop();
        }
        this._hCursor = null;
    };
    MongoCursorObserver.prototype._processCursor = function (cursor) {
        // On the server side fetch data, don't observe.
        if (Meteor.isServer) {
            var changes = [];
            var index = 0;
            for (var _i = 0, _a = cursor.fetch(); _i < _a.length; _i++) {
                var doc = _a[_i];
                changes.push(this._addAt(doc, index++));
            }
            this.emit(changes);
            return null;
        }
        var hCurObserver = this._startCursorObserver(cursor);
        return new cursor_handle_1.CursorHandle(hCurObserver);
    };
    MongoCursorObserver.prototype._startCursorObserver = function (cursor) {
        var _this = this;
        var changes = [];
        var callEmit = function () {
            _this.emit(changes.slice());
            changes.length = 0;
        };
        // Since cursor changes are now applied in bulk
        // (due to emit debouncing), scheduling macro task
        // allows us to use MeteorApp.onStable,
        // i.e. to know when the app is stable.
        var scheduleEmit = function () {
            return _this._ngZone.scheduleMacroTask('emit', callEmit, null, lang_1.noop);
        };
        var init = false;
        var runTask = function (task) {
            task.invoke();
            _this._ngZone.run(lang_1.noop);
            init = true;
        };
        var emit = null;
        if (this._debounceMs) {
            emit = utils_1.debounce(function (task) { return runTask(task); }, this._debounceMs, scheduleEmit);
        }
        else {
            var initAdd_1 = utils_1.debounce(function (task) { return runTask(task); }, 0, scheduleEmit);
            emit = function () {
                // This is for the case when cursor.observe
                // is called multiple times in a row
                // when the initial docs are being added.
                if (!init) {
                    initAdd_1();
                    return;
                }
                runTask(scheduleEmit());
            };
        }
        return utils_1.gZone.run(function () { return cursor.observe({
            addedAt: function (doc, index) {
                var change = _this._addAt(doc, index);
                changes.push(change);
                emit();
            },
            changedAt: function (nDoc, oDoc, index) {
                var change = _this._updateAt(nDoc, index);
                changes.push(change);
                emit();
            },
            movedTo: function (doc, fromIndex, toIndex) {
                var change = _this._moveTo(doc, fromIndex, toIndex);
                changes.push(change);
                emit();
            },
            removedAt: function (doc, atIndex) {
                var change = _this._removeAt(atIndex);
                changes.push(change);
                emit();
            }
        }); });
    };
    MongoCursorObserver.prototype._updateAt = function (doc, index) {
        return new UpdateChange(index, doc);
    };
    MongoCursorObserver.prototype._addAt = function (doc, index) {
        var change = new AddChange(index, doc);
        return change;
    };
    MongoCursorObserver.prototype._moveTo = function (doc, fromIndex, toIndex) {
        return new MoveChange(fromIndex, toIndex);
    };
    MongoCursorObserver.prototype._removeAt = function (index) {
        return new RemoveChange(index);
    };
    return MongoCursorObserver;
}(core_1.EventEmitter));
exports.MongoCursorObserver = MongoCursorObserver;
