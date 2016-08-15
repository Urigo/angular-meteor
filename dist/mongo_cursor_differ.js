'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var default_iterable_differ_1 = require('@angular/core/src/change_detection/differs/default_iterable_differ');
var mongo_cursor_observer_1 = require('./mongo_cursor_observer');
function checkIfMongoCursor(cursor) {
    return mongo_cursor_observer_1.MongoCursorObserver.isCursor(cursor);
}
// Creates an MongoCursorObserver instance for a Mongo.Cursor instance.
// Add one more level of abstraction, but currently is not really needed.
var MongoCursorObserverFactory = (function () {
    function MongoCursorObserverFactory() {
    }
    MongoCursorObserverFactory.prototype.create = function (cursor) {
        if (checkIfMongoCursor(cursor)) {
            return new mongo_cursor_observer_1.MongoCursorObserver(cursor);
        }
        return null;
    };
    return MongoCursorObserverFactory;
}());
// An instance of this factory (see providers.ts) is registered globally
// as one of the providers of collection differs.
// These providers are being checked by an ngFor instance to find out which
// differ it needs to create and use for the current collection.
var MongoCursorDifferFactory = (function (_super) {
    __extends(MongoCursorDifferFactory, _super);
    function MongoCursorDifferFactory() {
        _super.apply(this, arguments);
    }
    MongoCursorDifferFactory.prototype.supports = function (obj) { return checkIfMongoCursor(obj); };
    MongoCursorDifferFactory.prototype.create = function (cdRef) {
        return new MongoCursorDiffer(cdRef, new MongoCursorObserverFactory());
    };
    return MongoCursorDifferFactory;
}(default_iterable_differ_1.DefaultIterableDifferFactory));
exports.MongoCursorDifferFactory = MongoCursorDifferFactory;
var trackById = function (index, item) { return item._id; };
/**
 * A class that implements Angular 2's concept of differs for ngFor.
 * API consists mainly of diff method and methods like forEachAddedItem
 * that is being run on each change detection cycle to apply new changes if any.
 */
var MongoCursorDiffer = (function (_super) {
    __extends(MongoCursorDiffer, _super);
    function MongoCursorDiffer(cdRef, obsFactory) {
        _super.call(this, trackById);
        this._inserted = [];
        this._removed = [];
        this._moved = [];
        this._updated = [];
        this._changes = [];
        this._forSize = 0;
        this._zone = Zone.current;
        this._obsFactory = obsFactory;
    }
    MongoCursorDiffer.prototype.forEachAddedItem = function (fn) {
        for (var _i = 0, _a = this._inserted; _i < _a.length; _i++) {
            var insert = _a[_i];
            fn(insert);
        }
    };
    MongoCursorDiffer.prototype.forEachMovedItem = function (fn) {
        for (var _i = 0, _a = this._moved; _i < _a.length; _i++) {
            var move = _a[_i];
            fn(move);
        }
    };
    MongoCursorDiffer.prototype.forEachRemovedItem = function (fn) {
        for (var _i = 0, _a = this._removed; _i < _a.length; _i++) {
            var remove = _a[_i];
            fn(remove);
        }
    };
    MongoCursorDiffer.prototype.forEachIdentityChange = function (fn) {
        for (var _i = 0, _a = this._updated; _i < _a.length; _i++) {
            var update = _a[_i];
            fn(update);
        }
    };
    MongoCursorDiffer.prototype.forEachOperation = function (fn) {
        for (var _i = 0, _a = this._changes; _i < _a.length; _i++) {
            var change = _a[_i];
            fn(change, change.previousIndex, change.currentIndex);
        }
    };
    MongoCursorDiffer.prototype.diff = function (cursor) {
        var _this = this;
        this._reset();
        var newCursor = false;
        if (cursor && this._cursor !== cursor) {
            newCursor = true;
            this._destroyObserver();
            this._cursor = cursor;
            this._curObserver = this._obsFactory.create(cursor);
            this._sub = this._curObserver.subscribe({
                next: function (changes) { return _this._updateLatestValue(changes); }
            });
        }
        if (this._lastChanges) {
            this._applyChanges(this._lastChanges);
        }
        /**
         * If either last changes or new cursor is true, then
         * return "this" to notify Angular2 to re-build views.
         * If last changes or new cursor are true simultaneously
         * means that Mongo cursor has been changed and it's expected
         * that last changes (if any) of that cursor are additions only
         * (otherwise it won't likely work).
         * So removals of the previous cursor and additions of
         * the new one will processed at the same time.
         */
        if (this._lastChanges || newCursor) {
            this._lastChanges = null;
            return this;
        }
        return null;
    };
    MongoCursorDiffer.prototype.onDestroy = function () {
        this._destroyObserver();
    };
    Object.defineProperty(MongoCursorDiffer.prototype, "observer", {
        get: function () {
            return this._curObserver;
        },
        enumerable: true,
        configurable: true
    });
    MongoCursorDiffer.prototype._destroyObserver = function () {
        if (this._curObserver) {
            this._curObserver.destroy();
        }
        if (this._sub) {
            this._sub.unsubscribe();
        }
        this._applyCleanup();
    };
    MongoCursorDiffer.prototype._updateLatestValue = function (changes) {
        this._lastChanges = changes;
    };
    MongoCursorDiffer.prototype._reset = function () {
        this._inserted.length = 0;
        this._moved.length = 0;
        this._removed.length = 0;
        this._updated.length = 0;
        this._changes.length = 0;
    };
    // Reset previous state of the differ by removing all currently shown documents.
    MongoCursorDiffer.prototype._applyCleanup = function () {
        for (var index = 0; index < this._forSize; index++) {
            var remove = this._createChangeRecord(null, 0, null);
            this._removed.push(remove);
            this._changes.push(remove);
        }
        this._forSize = 0;
    };
    MongoCursorDiffer.prototype._applyChanges = function (changes) {
        for (var _i = 0, changes_1 = changes; _i < changes_1.length; _i++) {
            var change = changes_1[_i];
            if (change instanceof mongo_cursor_observer_1.AddChange) {
                var add = this._createChangeRecord(change.index, null, change.item);
                this._inserted.push(add);
                this._changes.push(add);
                this._forSize++;
            }
            if (change instanceof mongo_cursor_observer_1.MoveChange) {
                var move = this._createChangeRecord(change.toIndex, change.fromIndex, change.item);
                this._moved.push(move);
                this._changes.push(move);
            }
            if (change instanceof mongo_cursor_observer_1.RemoveChange) {
                var remove = this._createChangeRecord(null, change.index, change.item);
                this._removed.push(remove);
                this._changes.push(remove);
                this._forSize--;
            }
            if (change instanceof mongo_cursor_observer_1.UpdateChange) {
                this._updated.push(this._createChangeRecord(change.index, null, change.item));
            }
        }
    };
    MongoCursorDiffer.prototype._createChangeRecord = function (currentIndex, prevIndex, item) {
        var record = new default_iterable_differ_1.CollectionChangeRecord(item, trackById);
        record.currentIndex = currentIndex;
        record.previousIndex = prevIndex;
        return record;
    };
    return MongoCursorDiffer;
}(default_iterable_differ_1.DefaultIterableDiffer));
exports.MongoCursorDiffer = MongoCursorDiffer;
