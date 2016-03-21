(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var cursor_handle_1 = __webpack_require__(7);
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
	var Subscription = (function () {
	    function Subscription(_next, _error, _complete) {
	        this._next = _next;
	        this._error = _error;
	        this._complete = _complete;
	        this._isUnsubscribed = false;
	    }
	    Subscription.prototype.onNext = function (value) {
	        if (!this._isUnsubscribed && this._next) {
	            this._next(value);
	        }
	    };
	    Subscription.prototype.unsubscribe = function () {
	        this._isUnsubscribed = true;
	    };
	    return Subscription;
	}());
	exports.Subscription = Subscription;
	var MongoCursorObserver = (function () {
	    function MongoCursorObserver(cursor) {
	        this._docs = [];
	        this._added = [];
	        this._lastChanges = [];
	        this._subs = [];
	        this._isSubscribed = false;
	        check(cursor, Mongo.Cursor);
	        this._hCursor = this._startCursor(cursor);
	    }
	    Object.defineProperty(MongoCursorObserver.prototype, "lastChanges", {
	        get: function () {
	            return this._lastChanges;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Subcribes to the Mongo cursor changes.
	     *
	     * Since it's possible that some changes that been already collected
	     * before the moment someone subscribes to the observer,
	     * we emit these changes, but only to the first ever subscriber.
	     */
	    MongoCursorObserver.prototype.subscribe = function (_a) {
	        var next = _a.next, error = _a.error, complete = _a.complete;
	        var subscription = new Subscription(next, error, complete);
	        this._subs.push(subscription);
	        // If no subscriber has subscribed ever. 
	        if (!this._isSubscribed) {
	            this._isSubscribed = true;
	            if (this._added.length) {
	                this.emit(this._added.splice(0));
	            }
	        }
	        return subscription;
	    };
	    MongoCursorObserver.prototype.emit = function (value) {
	        if (this._subs) {
	            for (var _i = 0, _a = this._subs; _i < _a.length; _i++) {
	                var sub = _a[_i];
	                sub.onNext(value);
	            }
	        }
	    };
	    MongoCursorObserver.prototype._startCursor = function (cursor) {
	        var hCurObserver = this._startCursorObserver(cursor);
	        return new cursor_handle_1.CursorHandle(cursor, hCurObserver);
	    };
	    MongoCursorObserver.prototype._startCursorObserver = function (cursor) {
	        var self = this;
	        return cursor.observe({
	            addedAt: function (doc, index) {
	                var change = self._addAt(doc, index);
	                self.emit([change]);
	            },
	            changedAt: function (nDoc, oDoc, index) {
	                var doc = self._docs[index];
	                if (EJSON.equals(doc._id, nDoc._id)) {
	                    Object.assign(self._docs[index], nDoc);
	                }
	                else {
	                    self._docs[index] = nDoc;
	                }
	                var change = self._updateAt(self._docs[index], index);
	                self.emit([change]);
	            },
	            movedTo: function (doc, fromIndex, toIndex) {
	                var change = self._moveTo(doc, fromIndex, toIndex);
	                self.emit([change]);
	            },
	            removedAt: function (doc, atIndex) {
	                var change = self._removeAt(atIndex);
	                self.emit([change]);
	            }
	        });
	    };
	    MongoCursorObserver.prototype._updateAt = function (doc, index) {
	        return new UpdateChange(index, doc);
	    };
	    MongoCursorObserver.prototype._addAt = function (doc, index) {
	        this._docs.splice(index, 0, doc);
	        var change = new AddChange(index, doc);
	        if (!this._isSubscribed) {
	            this._added.push(change);
	        }
	        return change;
	    };
	    MongoCursorObserver.prototype._moveTo = function (doc, fromIndex, toIndex) {
	        this._docs.splice(fromIndex, 1);
	        this._docs.splice(toIndex, 0, doc);
	        return new MoveChange(fromIndex, toIndex);
	    };
	    MongoCursorObserver.prototype._removeAt = function (index) {
	        this._docs.splice(index, 1);
	        return new RemoveChange(index);
	    };
	    MongoCursorObserver.prototype.destroy = function () {
	        if (this._hCursor) {
	            this._hCursor.stop();
	        }
	        this._hCursor = null;
	        this._docs = null;
	        this._added = null;
	        this._subs = null;
	    };
	    return MongoCursorObserver;
	}());
	exports.MongoCursorObserver = MongoCursorObserver;


/***/ },

/***/ 7:
/***/ function(module, exports) {

	module.exports = require("./cursor_handle");

/***/ }

/******/ })));