'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var default_iterable_differ_1 = require('@angular/core/src/change_detection/differs/default_iterable_differ');
var async_1 = require('@angular/core/src/facade/async');
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
        this._listSize = 0;
        this._zone = Zone.current;
        this._obsFactory = obsFactory;
    }
    MongoCursorDiffer.prototype.forEachAddedItem = function (fn) {
        for (var i = 0; i < this._inserted.length; i++) {
            fn(this._inserted[i]);
        }
    };
    MongoCursorDiffer.prototype.forEachMovedItem = function (fn) {
        for (var i = 0; i < this._moved.length; i++) {
            fn(this._moved[i]);
        }
    };
    MongoCursorDiffer.prototype.forEachRemovedItem = function (fn) {
        for (var i = 0; i < this._removed.length; i++) {
            fn(this._removed[i]);
        }
    };
    MongoCursorDiffer.prototype.forEachIdentityChange = function (fn) {
        for (var i = 0; i < this._updated.length; i++) {
            fn(this._updated[i]);
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
            this._subscription = async_1.ObservableWrapper.subscribe(this._curObserver, function (changes) {
                _this._zone.run(function () { _this._updateLatestValue(changes); });
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
    };
    // Reset previous state of the differ by removing all currently shown documents.
    MongoCursorDiffer.prototype._applyCleanup = function () {
        for (var index = 0; index < this._listSize; index++) {
            this._removed.push(this._createChangeRecord(null, index, null));
        }
        this._listSize = 0;
    };
    MongoCursorDiffer.prototype._applyChanges = function (changes) {
        for (var i = 0; i < changes.length; i++) {
            if (changes[i] instanceof mongo_cursor_observer_1.AddChange) {
                this._inserted.push(this._createChangeRecord(changes[i].index, null, changes[i].item));
                this._listSize++;
            }
            if (changes[i] instanceof mongo_cursor_observer_1.MoveChange) {
                this._moved.push(this._createChangeRecord(changes[i].toIndex, changes[i].fromIndex, changes[i].item));
            }
            if (changes[i] instanceof mongo_cursor_observer_1.RemoveChange) {
                this._removed.push(this._createChangeRecord(null, changes[i].index, changes[i].item));
                this._listSize--;
            }
            if (changes[i] instanceof mongo_cursor_observer_1.UpdateChange) {
                this._updated.push(this._createChangeRecord(changes[i].index, null, changes[i].item));
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
