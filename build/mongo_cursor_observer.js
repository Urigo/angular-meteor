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
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var cursor_handle_1 = __webpack_require__(5);
	var EJSON = __webpack_require__(6);
	var AddChange = (function () {
	    function AddChange(index, item) {
	        this.index = index;
	        this.item = item;
	    }
	    return AddChange;
	})();
	exports.AddChange = AddChange;
	var UpdateChange = (function () {
	    function UpdateChange(index, item) {
	        this.index = index;
	        this.item = item;
	    }
	    return UpdateChange;
	})();
	exports.UpdateChange = UpdateChange;
	var MoveChange = (function () {
	    function MoveChange(fromIndex, toIndex) {
	        this.fromIndex = fromIndex;
	        this.toIndex = toIndex;
	    }
	    return MoveChange;
	})();
	exports.MoveChange = MoveChange;
	var RemoveChange = (function () {
	    function RemoveChange(index) {
	        this.index = index;
	    }
	    return RemoveChange;
	})();
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
	})();
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
	})();
	exports.MongoCursorObserver = MongoCursorObserver;


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports) {

	module.exports = require("./cursor_handle");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (function () {
	"use strict";
	var Meteor = { _noYieldsAllowed:function nope(f) { return f(); }};
	var EJSON, EJSONTest, i, Base64, root = {};
	var _ = __webpack_require__(7);
	// Base 64 encoding

	var BASE_64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

	var BASE_64_VALS = {};

	for (var i = 0; i < BASE_64_CHARS.length; i++) {
	  BASE_64_VALS[BASE_64_CHARS.charAt(i)] = i;
	};

	Base64 = {};

	Base64.encode = function (array) {

	  if (typeof array === "string") {
	    var str = array;
	    array = Base64.newBinary(str.length);
	    for (var i = 0; i < str.length; i++) {
	      var ch = str.charCodeAt(i);
	      if (ch > 0xFF) {
	        throw new Error(
	          "Not ascii. Base64.encode can only take ascii strings.");
	      }
	      array[i] = ch;
	    }
	  }

	  var answer = [];
	  var a = null;
	  var b = null;
	  var c = null;
	  var d = null;
	  for (var i = 0; i < array.length; i++) {
	    switch (i % 3) {
	    case 0:
	      a = (array[i] >> 2) & 0x3F;
	      b = (array[i] & 0x03) << 4;
	      break;
	    case 1:
	      b = b | (array[i] >> 4) & 0xF;
	      c = (array[i] & 0xF) << 2;
	      break;
	    case 2:
	      c = c | (array[i] >> 6) & 0x03;
	      d = array[i] & 0x3F;
	      answer.push(getChar(a));
	      answer.push(getChar(b));
	      answer.push(getChar(c));
	      answer.push(getChar(d));
	      a = null;
	      b = null;
	      c = null;
	      d = null;
	      break;
	    }
	  }
	  if (a != null) {
	    answer.push(getChar(a));
	    answer.push(getChar(b));
	    if (c == null)
	      answer.push('=');
	    else
	      answer.push(getChar(c));
	    if (d == null)
	      answer.push('=');
	  }
	  return answer.join("");
	};

	var getChar = function (val) {
	  return BASE_64_CHARS.charAt(val);
	};

	var getVal = function (ch) {
	  if (ch === '=') {
	    return -1;
	  }
	  return BASE_64_VALS[ch];
	};

	// XXX This is a weird place for this to live, but it's used both by
	// this package and 'ejson', and we can't put it in 'ejson' without
	// introducing a circular dependency. It should probably be in its own
	// package or as a helper in a package that both 'base64' and 'ejson'
	// use.
	Base64.newBinary = function (len) {
	  if (typeof Uint8Array === 'undefined' || typeof ArrayBuffer === 'undefined') {
	    var ret = [];
	    for (var i = 0; i < len; i++) {
	      ret.push(0);
	    }
	    ret.$Uint8ArrayPolyfill = true;
	    return ret;
	  }
	  return new Uint8Array(new ArrayBuffer(len));
	};

	Base64.decode = function (str) {
	  var len = Math.floor((str.length*3)/4);
	  if (str.charAt(str.length - 1) == '=') {
	    len--;
	    if (str.charAt(str.length - 2) == '=')
	      len--;
	  }
	  var arr = Base64.newBinary(len);

	  var one = null;
	  var two = null;
	  var three = null;

	  var j = 0;

	  for (var i = 0; i < str.length; i++) {
	    var c = str.charAt(i);
	    var v = getVal(c);
	    switch (i % 4) {
	    case 0:
	      if (v < 0)
	        throw new Error('invalid base64 string');
	      one = v << 2;
	      break;
	    case 1:
	      if (v < 0)
	        throw new Error('invalid base64 string');
	      one = one | (v >> 4);
	      arr[j++] = one;
	      two = (v & 0x0F) << 4;
	      break;
	    case 2:
	      if (v >= 0) {
	        two = two | (v >> 2);
	        arr[j++] = two;
	        three = (v & 0x03) << 6;
	      }
	      break;
	    case 3:
	      if (v >= 0) {
	        arr[j++] = three | v;
	      }
	      break;
	    }
	  }
	  return arr;
	};

	/**
	 * @namespace
	 * @summary Namespace for EJSON functions
	 */
	EJSON = {};
	EJSONTest = {};



	// Custom type interface definition
	/**
	 * @class CustomType
	 * @instanceName customType
	 * @memberOf EJSON
	 * @summary The interface that a class must satisfy to be able to become an
	 * EJSON custom type via EJSON.addType.
	 */

	/**
	 * @function typeName
	 * @memberOf EJSON.CustomType
	 * @summary Return the tag used to identify this type.  This must match the tag used to register this type with [`EJSON.addType`](#ejson_add_type).
	 * @locus Anywhere
	 * @instance
	 */

	/**
	 * @function toJSONValue
	 * @memberOf EJSON.CustomType
	 * @summary Serialize this instance into a JSON-compatible value.
	 * @locus Anywhere
	 * @instance
	 */

	/**
	 * @function clone
	 * @memberOf EJSON.CustomType
	 * @summary Return a value `r` such that `this.equals(r)` is true, and modifications to `r` do not affect `this` and vice versa.
	 * @locus Anywhere
	 * @instance
	 */

	/**
	 * @function equals
	 * @memberOf EJSON.CustomType
	 * @summary Return `true` if `other` has a value equal to `this`; `false` otherwise.
	 * @locus Anywhere
	 * @param {Object} other Another object to compare this to.
	 * @instance
	 */


	var customTypes = {};
	// Add a custom type, using a method of your choice to get to and
	// from a basic JSON-able representation.  The factory argument
	// is a function of JSON-able --> your object
	// The type you add must have:
	// - A toJSONValue() method, so that Meteor can serialize it
	// - a typeName() method, to show how to look it up in our type table.
	// It is okay if these methods are monkey-patched on.
	// EJSON.clone will use toJSONValue and the given factory to produce
	// a clone, but you may specify a method clone() that will be
	// used instead.
	// Similarly, EJSON.equals will use toJSONValue to make comparisons,
	// but you may provide a method equals() instead.
	/**
	 * @summary Add a custom datatype to EJSON.
	 * @locus Anywhere
	 * @param {String} name A tag for your custom type; must be unique among custom data types defined in your project, and must match the result of your type's `typeName` method.
	 * @param {Function} factory A function that deserializes a JSON-compatible value into an instance of your type.  This should match the serialization performed by your type's `toJSONValue` method.
	 */
	EJSON.addType = function (name, factory) {
	  if (_.has(customTypes, name))
	    throw new Error("Type " + name + " already present");
	  customTypes[name] = factory;
	};

	var isInfOrNan = function (obj) {
	  return _.isNaN(obj) || obj === Infinity || obj === -Infinity;
	};

	var builtinConverters = [
	  { // Date
	    matchJSONValue: function (obj) {
	      return _.has(obj, '$date') && _.size(obj) === 1;
	    },
	    matchObject: function (obj) {
	      return obj instanceof Date;
	    },
	    toJSONValue: function (obj) {
	      return {$date: obj.getTime()};
	    },
	    fromJSONValue: function (obj) {
	      return new Date(obj.$date);
	    }
	  },
	  { // NaN, Inf, -Inf. (These are the only objects with typeof !== 'object'
	    // which we match.)
	    matchJSONValue: function (obj) {
	      return _.has(obj, '$InfNaN') && _.size(obj) === 1;
	    },
	    matchObject: isInfOrNan,
	    toJSONValue: function (obj) {
	      var sign;
	      if (_.isNaN(obj))
	        sign = 0;
	      else if (obj === Infinity)
	        sign = 1;
	      else
	        sign = -1;
	      return {$InfNaN: sign};
	    },
	    fromJSONValue: function (obj) {
	      return obj.$InfNaN/0;
	    }
	  },
	  { // Binary
	    matchJSONValue: function (obj) {
	      return _.has(obj, '$binary') && _.size(obj) === 1;
	    },
	    matchObject: function (obj) {
	      return typeof Uint8Array !== 'undefined' && obj instanceof Uint8Array
	        || (obj && _.has(obj, '$Uint8ArrayPolyfill'));
	    },
	    toJSONValue: function (obj) {
	      return {$binary: Base64.encode(obj)};
	    },
	    fromJSONValue: function (obj) {
	      return Base64.decode(obj.$binary);
	    }
	  },
	  { // Escaping one level
	    matchJSONValue: function (obj) {
	      return _.has(obj, '$escape') && _.size(obj) === 1;
	    },
	    matchObject: function (obj) {
	      if (_.isEmpty(obj) || _.size(obj) > 2) {
	        return false;
	      }
	      return _.any(builtinConverters, function (converter) {
	        return converter.matchJSONValue(obj);
	      });
	    },
	    toJSONValue: function (obj) {
	      var newObj = {};
	      _.each(obj, function (value, key) {
	        newObj[key] = EJSON.toJSONValue(value);
	      });
	      return {$escape: newObj};
	    },
	    fromJSONValue: function (obj) {
	      var newObj = {};
	      _.each(obj.$escape, function (value, key) {
	        newObj[key] = EJSON.fromJSONValue(value);
	      });
	      return newObj;
	    }
	  },
	  { // Custom
	    matchJSONValue: function (obj) {
	      return _.has(obj, '$type') && _.has(obj, '$value') && _.size(obj) === 2;
	    },
	    matchObject: function (obj) {
	      return EJSON._isCustomType(obj);
	    },
	    toJSONValue: function (obj) {
	      var jsonValue = Meteor._noYieldsAllowed(function () {
	        return obj.toJSONValue();
	      });
	      return {$type: obj.typeName(), $value: jsonValue};
	    },
	    fromJSONValue: function (obj) {
	      var typeName = obj.$type;
	      if (!_.has(customTypes, typeName))
	        throw new Error("Custom EJSON type " + typeName + " is not defined");
	      var converter = customTypes[typeName];
	      return Meteor._noYieldsAllowed(function () {
	        return converter(obj.$value);
	      });
	    }
	  }
	];

	EJSON._isCustomType = function (obj) {
	  return obj &&
	    typeof obj.toJSONValue === 'function' &&
	    typeof obj.typeName === 'function' &&
	    _.has(customTypes, obj.typeName());
	};

	EJSON._getTypes = function () {
	  return customTypes;
	};

	EJSON._getConverters = function () {
	  return builtinConverters;
	};

	// for both arrays and objects, in-place modification.
	var adjustTypesToJSONValue =
	EJSON._adjustTypesToJSONValue = function (obj) {
	  // Is it an atom that we need to adjust?
	  if (obj === null)
	    return null;
	  var maybeChanged = toJSONValueHelper(obj);
	  if (maybeChanged !== undefined)
	    return maybeChanged;

	  // Other atoms are unchanged.
	  if (typeof obj !== 'object')
	    return obj;

	  // Iterate over array or object structure.
	  _.each(obj, function (value, key) {
	    if (typeof value !== 'object' && value !== undefined &&
	        !isInfOrNan(value))
	      return; // continue

	    var changed = toJSONValueHelper(value);
	    if (changed) {
	      obj[key] = changed;
	      return; // on to the next key
	    }
	    // if we get here, value is an object but not adjustable
	    // at this level.  recurse.
	    adjustTypesToJSONValue(value);
	  });
	  return obj;
	};

	// Either return the JSON-compatible version of the argument, or undefined (if
	// the item isn't itself replaceable, but maybe some fields in it are)
	var toJSONValueHelper = function (item) {
	  for (var i = 0; i < builtinConverters.length; i++) {
	    var converter = builtinConverters[i];
	    if (converter.matchObject(item)) {
	      return converter.toJSONValue(item);
	    }
	  }
	  return undefined;
	};

	/**
	 * @summary Serialize an EJSON-compatible value into its plain JSON representation.
	 * @locus Anywhere
	 * @param {EJSON} val A value to serialize to plain JSON.
	 */
	EJSON.toJSONValue = function (item) {
	  var changed = toJSONValueHelper(item);
	  if (changed !== undefined)
	    return changed;
	  if (typeof item === 'object') {
	    item = EJSON.clone(item);
	    adjustTypesToJSONValue(item);
	  }
	  return item;
	};

	// for both arrays and objects. Tries its best to just
	// use the object you hand it, but may return something
	// different if the object you hand it itself needs changing.
	//
	var adjustTypesFromJSONValue =
	EJSON._adjustTypesFromJSONValue = function (obj) {
	  if (obj === null)
	    return null;
	  var maybeChanged = fromJSONValueHelper(obj);
	  if (maybeChanged !== obj)
	    return maybeChanged;

	  // Other atoms are unchanged.
	  if (typeof obj !== 'object')
	    return obj;

	  _.each(obj, function (value, key) {
	    if (typeof value === 'object') {
	      var changed = fromJSONValueHelper(value);
	      if (value !== changed) {
	        obj[key] = changed;
	        return;
	      }
	      // if we get here, value is an object but not adjustable
	      // at this level.  recurse.
	      adjustTypesFromJSONValue(value);
	    }
	  });
	  return obj;
	};

	// Either return the argument changed to have the non-json
	// rep of itself (the Object version) or the argument itself.

	// DOES NOT RECURSE.  For actually getting the fully-changed value, use
	// EJSON.fromJSONValue
	var fromJSONValueHelper = function (value) {
	  if (typeof value === 'object' && value !== null) {
	    if (_.size(value) <= 2
	        && _.all(value, function (v, k) {
	          return typeof k === 'string' && k.substr(0, 1) === '$';
	        })) {
	      for (var i = 0; i < builtinConverters.length; i++) {
	        var converter = builtinConverters[i];
	        if (converter.matchJSONValue(value)) {
	          return converter.fromJSONValue(value);
	        }
	      }
	    }
	  }
	  return value;
	};

	/**
	 * @summary Deserialize an EJSON value from its plain JSON representation.
	 * @locus Anywhere
	 * @param {JSONCompatible} val A value to deserialize into EJSON.
	 */
	EJSON.fromJSONValue = function (item) {
	  var changed = fromJSONValueHelper(item);
	  if (changed === item && typeof item === 'object') {
	    item = EJSON.clone(item);
	    adjustTypesFromJSONValue(item);
	    return item;
	  } else {
	    return changed;
	  }
	};

	/**
	 * @summary Serialize a value to a string.

	For EJSON values, the serialization fully represents the value. For non-EJSON values, serializes the same way as `JSON.stringify`.
	 * @locus Anywhere
	 * @param {EJSON} val A value to stringify.
	 * @param {Object} [options]
	 * @param {Boolean | Integer | String} options.indent Indents objects and arrays for easy readability.  When `true`, indents by 2 spaces; when an integer, indents by that number of spaces; and when a string, uses the string as the indentation pattern.
	 * @param {Boolean} options.canonical When `true`, stringifies keys in an object in sorted order.
	 */
	EJSON.stringify = function (item, options) {
	  var json = EJSON.toJSONValue(item);
	  if (options && (options.canonical || options.indent)) {
	    return EJSON._canonicalStringify(json, options);
	  } else {
	    return JSON.stringify(json);
	  }
	};

	/**
	 * @summary Parse a string into an EJSON value. Throws an error if the string is not valid EJSON.
	 * @locus Anywhere
	 * @param {String} str A string to parse into an EJSON value.
	 */
	EJSON.parse = function (item) {
	  if (typeof item !== 'string')
	    throw new Error("EJSON.parse argument should be a string");
	  return EJSON.fromJSONValue(JSON.parse(item));
	};

	/**
	 * @summary Returns true if `x` is a buffer of binary data, as returned from [`EJSON.newBinary`](#ejson_new_binary).
	 * @param {Object} x The variable to check.
	 * @locus Anywhere
	 */
	EJSON.isBinary = function (obj) {
	  return !!((typeof Uint8Array !== 'undefined' && obj instanceof Uint8Array) ||
	    (obj && obj.$Uint8ArrayPolyfill));
	};

	/**
	 * @summary Return true if `a` and `b` are equal to each other.  Return false otherwise.  Uses the `equals` method on `a` if present, otherwise performs a deep comparison.
	 * @locus Anywhere
	 * @param {EJSON} a
	 * @param {EJSON} b
	 * @param {Object} [options]
	 * @param {Boolean} options.keyOrderSensitive Compare in key sensitive order, if supported by the JavaScript implementation.  For example, `{a: 1, b: 2}` is equal to `{b: 2, a: 1}` only when `keyOrderSensitive` is `false`.  The default is `false`.
	 */
	EJSON.equals = function (a, b, options) {
	  var i;
	  var keyOrderSensitive = !!(options && options.keyOrderSensitive);
	  if (a === b)
	    return true;
	  if (_.isNaN(a) && _.isNaN(b))
	    return true; // This differs from the IEEE spec for NaN equality, b/c we don't want
	                 // anything ever with a NaN to be poisoned from becoming equal to anything.
	  if (!a || !b) // if either one is falsy, they'd have to be === to be equal
	    return false;
	  if (!(typeof a === 'object' && typeof b === 'object'))
	    return false;
	  if (a instanceof Date && b instanceof Date)
	    return a.valueOf() === b.valueOf();
	  if (EJSON.isBinary(a) && EJSON.isBinary(b)) {
	    if (a.length !== b.length)
	      return false;
	    for (i = 0; i < a.length; i++) {
	      if (a[i] !== b[i])
	        return false;
	    }
	    return true;
	  }
	  if (typeof (a.equals) === 'function')
	    return a.equals(b, options);
	  if (typeof (b.equals) === 'function')
	    return b.equals(a, options);
	  if (a instanceof Array) {
	    if (!(b instanceof Array))
	      return false;
	    if (a.length !== b.length)
	      return false;
	    for (i = 0; i < a.length; i++) {
	      if (!EJSON.equals(a[i], b[i], options))
	        return false;
	    }
	    return true;
	  }
	  // fallback for custom types that don't implement their own equals
	  switch (EJSON._isCustomType(a) + EJSON._isCustomType(b)) {
	    case 1: return false;
	    case 2: return EJSON.equals(EJSON.toJSONValue(a), EJSON.toJSONValue(b));
	  }
	  // fall back to structural equality of objects
	  var ret;
	  if (keyOrderSensitive) {
	    var bKeys = [];
	    _.each(b, function (val, x) {
	        bKeys.push(x);
	    });
	    i = 0;
	    ret = _.all(a, function (val, x) {
	      if (i >= bKeys.length) {
	        return false;
	      }
	      if (x !== bKeys[i]) {
	        return false;
	      }
	      if (!EJSON.equals(val, b[bKeys[i]], options)) {
	        return false;
	      }
	      i++;
	      return true;
	    });
	    return ret && i === bKeys.length;
	  } else {
	    i = 0;
	    ret = _.all(a, function (val, key) {
	      if (!_.has(b, key)) {
	        return false;
	      }
	      if (!EJSON.equals(val, b[key], options)) {
	        return false;
	      }
	      i++;
	      return true;
	    });
	    return ret && _.size(b) === i;
	  }
	};

	/**
	 * @summary Return a deep copy of `val`.
	 * @locus Anywhere
	 * @param {EJSON} val A value to copy.
	 */
	EJSON.clone = function (v) {
	  var ret;
	  if (typeof v !== "object")
	    return v;
	  if (v === null)
	    return null; // null has typeof "object"
	  if (v instanceof Date)
	    return new Date(v.getTime());
	  // RegExps are not really EJSON elements (eg we don't define a serialization
	  // for them), but they're immutable anyway, so we can support them in clone.
	  if (v instanceof RegExp)
	    return v;
	  if (EJSON.isBinary(v)) {
	    ret = EJSON.newBinary(v.length);
	    for (var i = 0; i < v.length; i++) {
	      ret[i] = v[i];
	    }
	    return ret;
	  }
	  // XXX: Use something better than underscore's isArray
	  if (_.isArray(v) || _.isArguments(v)) {
	    // For some reason, _.map doesn't work in this context on Opera (weird test
	    // failures).
	    ret = [];
	    for (i = 0; i < v.length; i++)
	      ret[i] = EJSON.clone(v[i]);
	    return ret;
	  }
	  // handle general user-defined typed Objects if they have a clone method
	  if (typeof v.clone === 'function') {
	    return v.clone();
	  }
	  // handle other custom types
	  if (EJSON._isCustomType(v)) {
	    return EJSON.fromJSONValue(EJSON.clone(EJSON.toJSONValue(v)), true);
	  }
	  // handle other objects
	  ret = {};
	  _.each(v, function (value, key) {
	    ret[key] = EJSON.clone(value);
	  });
	  return ret;
	};

	/**
	 * @summary Allocate a new buffer of binary data that EJSON can serialize.
	 * @locus Anywhere
	 * @param {Number} size The number of bytes of binary data to allocate.
	 */
	// EJSON.newBinary is the public documented API for this functionality,
	// but the implementation is in the 'base64' package to avoid
	// introducing a circular dependency. (If the implementation were here,
	// then 'base64' would have to use EJSON.newBinary, and 'ejson' would
	// also have to use 'base64'.)
	EJSON.newBinary = Base64.newBinary;

	// Based on json2.js from https://github.com/douglascrockford/JSON-js
	//
	//    json2.js
	//    2012-10-08
	//
	//    Public Domain.
	//
	//    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

	function quote(string) {
	  return JSON.stringify(string);
	}

	var str = function (key, holder, singleIndent, outerIndent, canonical) {

	  // Produce a string from holder[key].

	  var i;          // The loop counter.
	  var k;          // The member key.
	  var v;          // The member value.
	  var length;
	  var innerIndent = outerIndent;
	  var partial;
	  var value = holder[key];

	  // What happens next depends on the value's type.

	  switch (typeof value) {
	  case 'string':
	    return quote(value);
	  case 'number':
	    // JSON numbers must be finite. Encode non-finite numbers as null.
	    return isFinite(value) ? String(value) : 'null';
	  case 'boolean':
	    return String(value);
	  // If the type is 'object', we might be dealing with an object or an array or
	  // null.
	  case 'object':
	    // Due to a specification blunder in ECMAScript, typeof null is 'object',
	    // so watch out for that case.
	    if (!value) {
	      return 'null';
	    }
	    // Make an array to hold the partial results of stringifying this object value.
	    innerIndent = outerIndent + singleIndent;
	    partial = [];

	    // Is the value an array?
	    if (_.isArray(value) || _.isArguments(value)) {

	      // The value is an array. Stringify every element. Use null as a placeholder
	      // for non-JSON values.

	      length = value.length;
	      for (i = 0; i < length; i += 1) {
	        partial[i] = str(i, value, singleIndent, innerIndent, canonical) || 'null';
	      }

	      // Join all of the elements together, separated with commas, and wrap them in
	      // brackets.

	      if (partial.length === 0) {
	        v = '[]';
	      } else if (innerIndent) {
	        v = '[\n' + innerIndent + partial.join(',\n' + innerIndent) + '\n' + outerIndent + ']';
	      } else {
	        v = '[' + partial.join(',') + ']';
	      }
	      return v;
	    }


	    // Iterate through all of the keys in the object.
	    var keys = _.keys(value);
	    if (canonical)
	      keys = keys.sort();
	    _.each(keys, function (k) {
	      v = str(k, value, singleIndent, innerIndent, canonical);
	      if (v) {
	        partial.push(quote(k) + (innerIndent ? ': ' : ':') + v);
	      }
	    });


	    // Join all of the member texts together, separated with commas,
	    // and wrap them in braces.

	    if (partial.length === 0) {
	      v = '{}';
	    } else if (innerIndent) {
	      v = '{\n' + innerIndent + partial.join(',\n' + innerIndent) + '\n' + outerIndent + '}';
	    } else {
	      v = '{' + partial.join(',') + '}';
	    }
	    return v;
	  }
	}

	// If the JSON object does not yet have a stringify method, give it one.

	EJSON._canonicalStringify = function (value, options) {
	  // Make a fake root object containing our value under the key of ''.
	  // Return the result of stringifying the value.
	  options = _.extend({
	    indent: "",
	    canonical: false
	  }, options);
	  if (options.indent === true) {
	    options.indent = "  ";
	  } else if (typeof options.indent === 'number') {
	    var newIndent = "";
	    for (var i = 0; i < options.indent; i++) {
	      newIndent += ' ';
	    }
	    options.indent = newIndent;
	  }
	  return str('', {'': value}, options.indent, "", options.canonical);
	};

	  return EJSON;
	}).call(this);

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.8.3
	//     http://underscorejs.org
	//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	//     Underscore may be freely distributed under the MIT license.

	(function() {

	  // Baseline setup
	  // --------------

	  // Establish the root object, `window` in the browser, or `exports` on the server.
	  var root = this;

	  // Save the previous value of the `_` variable.
	  var previousUnderscore = root._;

	  // Save bytes in the minified (but not gzipped) version:
	  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

	  // Create quick reference variables for speed access to core prototypes.
	  var
	    push             = ArrayProto.push,
	    slice            = ArrayProto.slice,
	    toString         = ObjProto.toString,
	    hasOwnProperty   = ObjProto.hasOwnProperty;

	  // All **ECMAScript 5** native function implementations that we hope to use
	  // are declared here.
	  var
	    nativeIsArray      = Array.isArray,
	    nativeKeys         = Object.keys,
	    nativeBind         = FuncProto.bind,
	    nativeCreate       = Object.create;

	  // Naked function reference for surrogate-prototype-swapping.
	  var Ctor = function(){};

	  // Create a safe reference to the Underscore object for use below.
	  var _ = function(obj) {
	    if (obj instanceof _) return obj;
	    if (!(this instanceof _)) return new _(obj);
	    this._wrapped = obj;
	  };

	  // Export the Underscore object for **Node.js**, with
	  // backwards-compatibility for the old `require()` API. If we're in
	  // the browser, add `_` as a global object.
	  if (true) {
	    if (typeof module !== 'undefined' && module.exports) {
	      exports = module.exports = _;
	    }
	    exports._ = _;
	  } else {
	    root._ = _;
	  }

	  // Current version.
	  _.VERSION = '1.8.3';

	  // Internal function that returns an efficient (for current engines) version
	  // of the passed-in callback, to be repeatedly applied in other Underscore
	  // functions.
	  var optimizeCb = function(func, context, argCount) {
	    if (context === void 0) return func;
	    switch (argCount == null ? 3 : argCount) {
	      case 1: return function(value) {
	        return func.call(context, value);
	      };
	      case 2: return function(value, other) {
	        return func.call(context, value, other);
	      };
	      case 3: return function(value, index, collection) {
	        return func.call(context, value, index, collection);
	      };
	      case 4: return function(accumulator, value, index, collection) {
	        return func.call(context, accumulator, value, index, collection);
	      };
	    }
	    return function() {
	      return func.apply(context, arguments);
	    };
	  };

	  // A mostly-internal function to generate callbacks that can be applied
	  // to each element in a collection, returning the desired result — either
	  // identity, an arbitrary callback, a property matcher, or a property accessor.
	  var cb = function(value, context, argCount) {
	    if (value == null) return _.identity;
	    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
	    if (_.isObject(value)) return _.matcher(value);
	    return _.property(value);
	  };
	  _.iteratee = function(value, context) {
	    return cb(value, context, Infinity);
	  };

	  // An internal function for creating assigner functions.
	  var createAssigner = function(keysFunc, undefinedOnly) {
	    return function(obj) {
	      var length = arguments.length;
	      if (length < 2 || obj == null) return obj;
	      for (var index = 1; index < length; index++) {
	        var source = arguments[index],
	            keys = keysFunc(source),
	            l = keys.length;
	        for (var i = 0; i < l; i++) {
	          var key = keys[i];
	          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
	        }
	      }
	      return obj;
	    };
	  };

	  // An internal function for creating a new object that inherits from another.
	  var baseCreate = function(prototype) {
	    if (!_.isObject(prototype)) return {};
	    if (nativeCreate) return nativeCreate(prototype);
	    Ctor.prototype = prototype;
	    var result = new Ctor;
	    Ctor.prototype = null;
	    return result;
	  };

	  var property = function(key) {
	    return function(obj) {
	      return obj == null ? void 0 : obj[key];
	    };
	  };

	  // Helper for collection methods to determine whether a collection
	  // should be iterated as an array or as an object
	  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
	  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
	  var getLength = property('length');
	  var isArrayLike = function(collection) {
	    var length = getLength(collection);
	    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	  };

	  // Collection Functions
	  // --------------------

	  // The cornerstone, an `each` implementation, aka `forEach`.
	  // Handles raw objects in addition to array-likes. Treats all
	  // sparse array-likes as if they were dense.
	  _.each = _.forEach = function(obj, iteratee, context) {
	    iteratee = optimizeCb(iteratee, context);
	    var i, length;
	    if (isArrayLike(obj)) {
	      for (i = 0, length = obj.length; i < length; i++) {
	        iteratee(obj[i], i, obj);
	      }
	    } else {
	      var keys = _.keys(obj);
	      for (i = 0, length = keys.length; i < length; i++) {
	        iteratee(obj[keys[i]], keys[i], obj);
	      }
	    }
	    return obj;
	  };

	  // Return the results of applying the iteratee to each element.
	  _.map = _.collect = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length,
	        results = Array(length);
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      results[index] = iteratee(obj[currentKey], currentKey, obj);
	    }
	    return results;
	  };

	  // Create a reducing function iterating left or right.
	  function createReduce(dir) {
	    // Optimized iterator function as using arguments.length
	    // in the main function will deoptimize the, see #1991.
	    function iterator(obj, iteratee, memo, keys, index, length) {
	      for (; index >= 0 && index < length; index += dir) {
	        var currentKey = keys ? keys[index] : index;
	        memo = iteratee(memo, obj[currentKey], currentKey, obj);
	      }
	      return memo;
	    }

	    return function(obj, iteratee, memo, context) {
	      iteratee = optimizeCb(iteratee, context, 4);
	      var keys = !isArrayLike(obj) && _.keys(obj),
	          length = (keys || obj).length,
	          index = dir > 0 ? 0 : length - 1;
	      // Determine the initial value if none is provided.
	      if (arguments.length < 3) {
	        memo = obj[keys ? keys[index] : index];
	        index += dir;
	      }
	      return iterator(obj, iteratee, memo, keys, index, length);
	    };
	  }

	  // **Reduce** builds up a single result from a list of values, aka `inject`,
	  // or `foldl`.
	  _.reduce = _.foldl = _.inject = createReduce(1);

	  // The right-associative version of reduce, also known as `foldr`.
	  _.reduceRight = _.foldr = createReduce(-1);

	  // Return the first value which passes a truth test. Aliased as `detect`.
	  _.find = _.detect = function(obj, predicate, context) {
	    var key;
	    if (isArrayLike(obj)) {
	      key = _.findIndex(obj, predicate, context);
	    } else {
	      key = _.findKey(obj, predicate, context);
	    }
	    if (key !== void 0 && key !== -1) return obj[key];
	  };

	  // Return all the elements that pass a truth test.
	  // Aliased as `select`.
	  _.filter = _.select = function(obj, predicate, context) {
	    var results = [];
	    predicate = cb(predicate, context);
	    _.each(obj, function(value, index, list) {
	      if (predicate(value, index, list)) results.push(value);
	    });
	    return results;
	  };

	  // Return all the elements for which a truth test fails.
	  _.reject = function(obj, predicate, context) {
	    return _.filter(obj, _.negate(cb(predicate)), context);
	  };

	  // Determine whether all of the elements match a truth test.
	  // Aliased as `all`.
	  _.every = _.all = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (!predicate(obj[currentKey], currentKey, obj)) return false;
	    }
	    return true;
	  };

	  // Determine if at least one element in the object matches a truth test.
	  // Aliased as `any`.
	  _.some = _.any = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (predicate(obj[currentKey], currentKey, obj)) return true;
	    }
	    return false;
	  };

	  // Determine if the array or object contains a given item (using `===`).
	  // Aliased as `includes` and `include`.
	  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
	    if (!isArrayLike(obj)) obj = _.values(obj);
	    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
	    return _.indexOf(obj, item, fromIndex) >= 0;
	  };

	  // Invoke a method (with arguments) on every item in a collection.
	  _.invoke = function(obj, method) {
	    var args = slice.call(arguments, 2);
	    var isFunc = _.isFunction(method);
	    return _.map(obj, function(value) {
	      var func = isFunc ? method : value[method];
	      return func == null ? func : func.apply(value, args);
	    });
	  };

	  // Convenience version of a common use case of `map`: fetching a property.
	  _.pluck = function(obj, key) {
	    return _.map(obj, _.property(key));
	  };

	  // Convenience version of a common use case of `filter`: selecting only objects
	  // containing specific `key:value` pairs.
	  _.where = function(obj, attrs) {
	    return _.filter(obj, _.matcher(attrs));
	  };

	  // Convenience version of a common use case of `find`: getting the first object
	  // containing specific `key:value` pairs.
	  _.findWhere = function(obj, attrs) {
	    return _.find(obj, _.matcher(attrs));
	  };

	  // Return the maximum element (or element-based computation).
	  _.max = function(obj, iteratee, context) {
	    var result = -Infinity, lastComputed = -Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value > result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };

	  // Return the minimum element (or element-based computation).
	  _.min = function(obj, iteratee, context) {
	    var result = Infinity, lastComputed = Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value < result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed < lastComputed || computed === Infinity && result === Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };

	  // Shuffle a collection, using the modern version of the
	  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
	  _.shuffle = function(obj) {
	    var set = isArrayLike(obj) ? obj : _.values(obj);
	    var length = set.length;
	    var shuffled = Array(length);
	    for (var index = 0, rand; index < length; index++) {
	      rand = _.random(0, index);
	      if (rand !== index) shuffled[index] = shuffled[rand];
	      shuffled[rand] = set[index];
	    }
	    return shuffled;
	  };

	  // Sample **n** random values from a collection.
	  // If **n** is not specified, returns a single random element.
	  // The internal `guard` argument allows it to work with `map`.
	  _.sample = function(obj, n, guard) {
	    if (n == null || guard) {
	      if (!isArrayLike(obj)) obj = _.values(obj);
	      return obj[_.random(obj.length - 1)];
	    }
	    return _.shuffle(obj).slice(0, Math.max(0, n));
	  };

	  // Sort the object's values by a criterion produced by an iteratee.
	  _.sortBy = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    return _.pluck(_.map(obj, function(value, index, list) {
	      return {
	        value: value,
	        index: index,
	        criteria: iteratee(value, index, list)
	      };
	    }).sort(function(left, right) {
	      var a = left.criteria;
	      var b = right.criteria;
	      if (a !== b) {
	        if (a > b || a === void 0) return 1;
	        if (a < b || b === void 0) return -1;
	      }
	      return left.index - right.index;
	    }), 'value');
	  };

	  // An internal function used for aggregate "group by" operations.
	  var group = function(behavior) {
	    return function(obj, iteratee, context) {
	      var result = {};
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index) {
	        var key = iteratee(value, index, obj);
	        behavior(result, value, key);
	      });
	      return result;
	    };
	  };

	  // Groups the object's values by a criterion. Pass either a string attribute
	  // to group by, or a function that returns the criterion.
	  _.groupBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
	  });

	  // Indexes the object's values by a criterion, similar to `groupBy`, but for
	  // when you know that your index values will be unique.
	  _.indexBy = group(function(result, value, key) {
	    result[key] = value;
	  });

	  // Counts instances of an object that group by a certain criterion. Pass
	  // either a string attribute to count by, or a function that returns the
	  // criterion.
	  _.countBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key]++; else result[key] = 1;
	  });

	  // Safely create a real, live array from anything iterable.
	  _.toArray = function(obj) {
	    if (!obj) return [];
	    if (_.isArray(obj)) return slice.call(obj);
	    if (isArrayLike(obj)) return _.map(obj, _.identity);
	    return _.values(obj);
	  };

	  // Return the number of elements in an object.
	  _.size = function(obj) {
	    if (obj == null) return 0;
	    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
	  };

	  // Split a collection into two arrays: one whose elements all satisfy the given
	  // predicate, and one whose elements all do not satisfy the predicate.
	  _.partition = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var pass = [], fail = [];
	    _.each(obj, function(value, key, obj) {
	      (predicate(value, key, obj) ? pass : fail).push(value);
	    });
	    return [pass, fail];
	  };

	  // Array Functions
	  // ---------------

	  // Get the first element of an array. Passing **n** will return the first N
	  // values in the array. Aliased as `head` and `take`. The **guard** check
	  // allows it to work with `_.map`.
	  _.first = _.head = _.take = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[0];
	    return _.initial(array, array.length - n);
	  };

	  // Returns everything but the last entry of the array. Especially useful on
	  // the arguments object. Passing **n** will return all the values in
	  // the array, excluding the last N.
	  _.initial = function(array, n, guard) {
	    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
	  };

	  // Get the last element of an array. Passing **n** will return the last N
	  // values in the array.
	  _.last = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[array.length - 1];
	    return _.rest(array, Math.max(0, array.length - n));
	  };

	  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
	  // Especially useful on the arguments object. Passing an **n** will return
	  // the rest N values in the array.
	  _.rest = _.tail = _.drop = function(array, n, guard) {
	    return slice.call(array, n == null || guard ? 1 : n);
	  };

	  // Trim out all falsy values from an array.
	  _.compact = function(array) {
	    return _.filter(array, _.identity);
	  };

	  // Internal implementation of a recursive `flatten` function.
	  var flatten = function(input, shallow, strict, startIndex) {
	    var output = [], idx = 0;
	    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
	      var value = input[i];
	      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
	        //flatten current level of array or arguments object
	        if (!shallow) value = flatten(value, shallow, strict);
	        var j = 0, len = value.length;
	        output.length += len;
	        while (j < len) {
	          output[idx++] = value[j++];
	        }
	      } else if (!strict) {
	        output[idx++] = value;
	      }
	    }
	    return output;
	  };

	  // Flatten out an array, either recursively (by default), or just one level.
	  _.flatten = function(array, shallow) {
	    return flatten(array, shallow, false);
	  };

	  // Return a version of the array that does not contain the specified value(s).
	  _.without = function(array) {
	    return _.difference(array, slice.call(arguments, 1));
	  };

	  // Produce a duplicate-free version of the array. If the array has already
	  // been sorted, you have the option of using a faster algorithm.
	  // Aliased as `unique`.
	  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
	    if (!_.isBoolean(isSorted)) {
	      context = iteratee;
	      iteratee = isSorted;
	      isSorted = false;
	    }
	    if (iteratee != null) iteratee = cb(iteratee, context);
	    var result = [];
	    var seen = [];
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var value = array[i],
	          computed = iteratee ? iteratee(value, i, array) : value;
	      if (isSorted) {
	        if (!i || seen !== computed) result.push(value);
	        seen = computed;
	      } else if (iteratee) {
	        if (!_.contains(seen, computed)) {
	          seen.push(computed);
	          result.push(value);
	        }
	      } else if (!_.contains(result, value)) {
	        result.push(value);
	      }
	    }
	    return result;
	  };

	  // Produce an array that contains the union: each distinct element from all of
	  // the passed-in arrays.
	  _.union = function() {
	    return _.uniq(flatten(arguments, true, true));
	  };

	  // Produce an array that contains every item shared between all the
	  // passed-in arrays.
	  _.intersection = function(array) {
	    var result = [];
	    var argsLength = arguments.length;
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var item = array[i];
	      if (_.contains(result, item)) continue;
	      for (var j = 1; j < argsLength; j++) {
	        if (!_.contains(arguments[j], item)) break;
	      }
	      if (j === argsLength) result.push(item);
	    }
	    return result;
	  };

	  // Take the difference between one array and a number of other arrays.
	  // Only the elements present in just the first array will remain.
	  _.difference = function(array) {
	    var rest = flatten(arguments, true, true, 1);
	    return _.filter(array, function(value){
	      return !_.contains(rest, value);
	    });
	  };

	  // Zip together multiple lists into a single array -- elements that share
	  // an index go together.
	  _.zip = function() {
	    return _.unzip(arguments);
	  };

	  // Complement of _.zip. Unzip accepts an array of arrays and groups
	  // each array's elements on shared indices
	  _.unzip = function(array) {
	    var length = array && _.max(array, getLength).length || 0;
	    var result = Array(length);

	    for (var index = 0; index < length; index++) {
	      result[index] = _.pluck(array, index);
	    }
	    return result;
	  };

	  // Converts lists into objects. Pass either a single array of `[key, value]`
	  // pairs, or two parallel arrays of the same length -- one of keys, and one of
	  // the corresponding values.
	  _.object = function(list, values) {
	    var result = {};
	    for (var i = 0, length = getLength(list); i < length; i++) {
	      if (values) {
	        result[list[i]] = values[i];
	      } else {
	        result[list[i][0]] = list[i][1];
	      }
	    }
	    return result;
	  };

	  // Generator function to create the findIndex and findLastIndex functions
	  function createPredicateIndexFinder(dir) {
	    return function(array, predicate, context) {
	      predicate = cb(predicate, context);
	      var length = getLength(array);
	      var index = dir > 0 ? 0 : length - 1;
	      for (; index >= 0 && index < length; index += dir) {
	        if (predicate(array[index], index, array)) return index;
	      }
	      return -1;
	    };
	  }

	  // Returns the first index on an array-like that passes a predicate test
	  _.findIndex = createPredicateIndexFinder(1);
	  _.findLastIndex = createPredicateIndexFinder(-1);

	  // Use a comparator function to figure out the smallest index at which
	  // an object should be inserted so as to maintain order. Uses binary search.
	  _.sortedIndex = function(array, obj, iteratee, context) {
	    iteratee = cb(iteratee, context, 1);
	    var value = iteratee(obj);
	    var low = 0, high = getLength(array);
	    while (low < high) {
	      var mid = Math.floor((low + high) / 2);
	      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
	    }
	    return low;
	  };

	  // Generator function to create the indexOf and lastIndexOf functions
	  function createIndexFinder(dir, predicateFind, sortedIndex) {
	    return function(array, item, idx) {
	      var i = 0, length = getLength(array);
	      if (typeof idx == 'number') {
	        if (dir > 0) {
	            i = idx >= 0 ? idx : Math.max(idx + length, i);
	        } else {
	            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
	        }
	      } else if (sortedIndex && idx && length) {
	        idx = sortedIndex(array, item);
	        return array[idx] === item ? idx : -1;
	      }
	      if (item !== item) {
	        idx = predicateFind(slice.call(array, i, length), _.isNaN);
	        return idx >= 0 ? idx + i : -1;
	      }
	      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
	        if (array[idx] === item) return idx;
	      }
	      return -1;
	    };
	  }

	  // Return the position of the first occurrence of an item in an array,
	  // or -1 if the item is not included in the array.
	  // If the array is large and already in sort order, pass `true`
	  // for **isSorted** to use binary search.
	  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
	  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

	  // Generate an integer Array containing an arithmetic progression. A port of
	  // the native Python `range()` function. See
	  // [the Python documentation](http://docs.python.org/library/functions.html#range).
	  _.range = function(start, stop, step) {
	    if (stop == null) {
	      stop = start || 0;
	      start = 0;
	    }
	    step = step || 1;

	    var length = Math.max(Math.ceil((stop - start) / step), 0);
	    var range = Array(length);

	    for (var idx = 0; idx < length; idx++, start += step) {
	      range[idx] = start;
	    }

	    return range;
	  };

	  // Function (ahem) Functions
	  // ------------------

	  // Determines whether to execute a function as a constructor
	  // or a normal function with the provided arguments
	  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
	    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
	    var self = baseCreate(sourceFunc.prototype);
	    var result = sourceFunc.apply(self, args);
	    if (_.isObject(result)) return result;
	    return self;
	  };

	  // Create a function bound to a given object (assigning `this`, and arguments,
	  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
	  // available.
	  _.bind = function(func, context) {
	    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
	    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
	    var args = slice.call(arguments, 2);
	    var bound = function() {
	      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
	    };
	    return bound;
	  };

	  // Partially apply a function by creating a version that has had some of its
	  // arguments pre-filled, without changing its dynamic `this` context. _ acts
	  // as a placeholder, allowing any combination of arguments to be pre-filled.
	  _.partial = function(func) {
	    var boundArgs = slice.call(arguments, 1);
	    var bound = function() {
	      var position = 0, length = boundArgs.length;
	      var args = Array(length);
	      for (var i = 0; i < length; i++) {
	        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
	      }
	      while (position < arguments.length) args.push(arguments[position++]);
	      return executeBound(func, bound, this, this, args);
	    };
	    return bound;
	  };

	  // Bind a number of an object's methods to that object. Remaining arguments
	  // are the method names to be bound. Useful for ensuring that all callbacks
	  // defined on an object belong to it.
	  _.bindAll = function(obj) {
	    var i, length = arguments.length, key;
	    if (length <= 1) throw new Error('bindAll must be passed function names');
	    for (i = 1; i < length; i++) {
	      key = arguments[i];
	      obj[key] = _.bind(obj[key], obj);
	    }
	    return obj;
	  };

	  // Memoize an expensive function by storing its results.
	  _.memoize = function(func, hasher) {
	    var memoize = function(key) {
	      var cache = memoize.cache;
	      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
	      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
	      return cache[address];
	    };
	    memoize.cache = {};
	    return memoize;
	  };

	  // Delays a function for the given number of milliseconds, and then calls
	  // it with the arguments supplied.
	  _.delay = function(func, wait) {
	    var args = slice.call(arguments, 2);
	    return setTimeout(function(){
	      return func.apply(null, args);
	    }, wait);
	  };

	  // Defers a function, scheduling it to run after the current call stack has
	  // cleared.
	  _.defer = _.partial(_.delay, _, 1);

	  // Returns a function, that, when invoked, will only be triggered at most once
	  // during a given window of time. Normally, the throttled function will run
	  // as much as it can, without ever going more than once per `wait` duration;
	  // but if you'd like to disable the execution on the leading edge, pass
	  // `{leading: false}`. To disable execution on the trailing edge, ditto.
	  _.throttle = function(func, wait, options) {
	    var context, args, result;
	    var timeout = null;
	    var previous = 0;
	    if (!options) options = {};
	    var later = function() {
	      previous = options.leading === false ? 0 : _.now();
	      timeout = null;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    };
	    return function() {
	      var now = _.now();
	      if (!previous && options.leading === false) previous = now;
	      var remaining = wait - (now - previous);
	      context = this;
	      args = arguments;
	      if (remaining <= 0 || remaining > wait) {
	        if (timeout) {
	          clearTimeout(timeout);
	          timeout = null;
	        }
	        previous = now;
	        result = func.apply(context, args);
	        if (!timeout) context = args = null;
	      } else if (!timeout && options.trailing !== false) {
	        timeout = setTimeout(later, remaining);
	      }
	      return result;
	    };
	  };

	  // Returns a function, that, as long as it continues to be invoked, will not
	  // be triggered. The function will be called after it stops being called for
	  // N milliseconds. If `immediate` is passed, trigger the function on the
	  // leading edge, instead of the trailing.
	  _.debounce = function(func, wait, immediate) {
	    var timeout, args, context, timestamp, result;

	    var later = function() {
	      var last = _.now() - timestamp;

	      if (last < wait && last >= 0) {
	        timeout = setTimeout(later, wait - last);
	      } else {
	        timeout = null;
	        if (!immediate) {
	          result = func.apply(context, args);
	          if (!timeout) context = args = null;
	        }
	      }
	    };

	    return function() {
	      context = this;
	      args = arguments;
	      timestamp = _.now();
	      var callNow = immediate && !timeout;
	      if (!timeout) timeout = setTimeout(later, wait);
	      if (callNow) {
	        result = func.apply(context, args);
	        context = args = null;
	      }

	      return result;
	    };
	  };

	  // Returns the first function passed as an argument to the second,
	  // allowing you to adjust arguments, run code before and after, and
	  // conditionally execute the original function.
	  _.wrap = function(func, wrapper) {
	    return _.partial(wrapper, func);
	  };

	  // Returns a negated version of the passed-in predicate.
	  _.negate = function(predicate) {
	    return function() {
	      return !predicate.apply(this, arguments);
	    };
	  };

	  // Returns a function that is the composition of a list of functions, each
	  // consuming the return value of the function that follows.
	  _.compose = function() {
	    var args = arguments;
	    var start = args.length - 1;
	    return function() {
	      var i = start;
	      var result = args[start].apply(this, arguments);
	      while (i--) result = args[i].call(this, result);
	      return result;
	    };
	  };

	  // Returns a function that will only be executed on and after the Nth call.
	  _.after = function(times, func) {
	    return function() {
	      if (--times < 1) {
	        return func.apply(this, arguments);
	      }
	    };
	  };

	  // Returns a function that will only be executed up to (but not including) the Nth call.
	  _.before = function(times, func) {
	    var memo;
	    return function() {
	      if (--times > 0) {
	        memo = func.apply(this, arguments);
	      }
	      if (times <= 1) func = null;
	      return memo;
	    };
	  };

	  // Returns a function that will be executed at most one time, no matter how
	  // often you call it. Useful for lazy initialization.
	  _.once = _.partial(_.before, 2);

	  // Object Functions
	  // ----------------

	  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
	  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
	  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
	                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

	  function collectNonEnumProps(obj, keys) {
	    var nonEnumIdx = nonEnumerableProps.length;
	    var constructor = obj.constructor;
	    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

	    // Constructor is a special case.
	    var prop = 'constructor';
	    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

	    while (nonEnumIdx--) {
	      prop = nonEnumerableProps[nonEnumIdx];
	      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
	        keys.push(prop);
	      }
	    }
	  }

	  // Retrieve the names of an object's own properties.
	  // Delegates to **ECMAScript 5**'s native `Object.keys`
	  _.keys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    if (nativeKeys) return nativeKeys(obj);
	    var keys = [];
	    for (var key in obj) if (_.has(obj, key)) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };

	  // Retrieve all the property names of an object.
	  _.allKeys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    var keys = [];
	    for (var key in obj) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };

	  // Retrieve the values of an object's properties.
	  _.values = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var values = Array(length);
	    for (var i = 0; i < length; i++) {
	      values[i] = obj[keys[i]];
	    }
	    return values;
	  };

	  // Returns the results of applying the iteratee to each element of the object
	  // In contrast to _.map it returns an object
	  _.mapObject = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys =  _.keys(obj),
	          length = keys.length,
	          results = {},
	          currentKey;
	      for (var index = 0; index < length; index++) {
	        currentKey = keys[index];
	        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
	      }
	      return results;
	  };

	  // Convert an object into a list of `[key, value]` pairs.
	  _.pairs = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var pairs = Array(length);
	    for (var i = 0; i < length; i++) {
	      pairs[i] = [keys[i], obj[keys[i]]];
	    }
	    return pairs;
	  };

	  // Invert the keys and values of an object. The values must be serializable.
	  _.invert = function(obj) {
	    var result = {};
	    var keys = _.keys(obj);
	    for (var i = 0, length = keys.length; i < length; i++) {
	      result[obj[keys[i]]] = keys[i];
	    }
	    return result;
	  };

	  // Return a sorted list of the function names available on the object.
	  // Aliased as `methods`
	  _.functions = _.methods = function(obj) {
	    var names = [];
	    for (var key in obj) {
	      if (_.isFunction(obj[key])) names.push(key);
	    }
	    return names.sort();
	  };

	  // Extend a given object with all the properties in passed-in object(s).
	  _.extend = createAssigner(_.allKeys);

	  // Assigns a given object with all the own properties in the passed-in object(s)
	  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
	  _.extendOwn = _.assign = createAssigner(_.keys);

	  // Returns the first key on an object that passes a predicate test
	  _.findKey = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = _.keys(obj), key;
	    for (var i = 0, length = keys.length; i < length; i++) {
	      key = keys[i];
	      if (predicate(obj[key], key, obj)) return key;
	    }
	  };

	  // Return a copy of the object only containing the whitelisted properties.
	  _.pick = function(object, oiteratee, context) {
	    var result = {}, obj = object, iteratee, keys;
	    if (obj == null) return result;
	    if (_.isFunction(oiteratee)) {
	      keys = _.allKeys(obj);
	      iteratee = optimizeCb(oiteratee, context);
	    } else {
	      keys = flatten(arguments, false, false, 1);
	      iteratee = function(value, key, obj) { return key in obj; };
	      obj = Object(obj);
	    }
	    for (var i = 0, length = keys.length; i < length; i++) {
	      var key = keys[i];
	      var value = obj[key];
	      if (iteratee(value, key, obj)) result[key] = value;
	    }
	    return result;
	  };

	   // Return a copy of the object without the blacklisted properties.
	  _.omit = function(obj, iteratee, context) {
	    if (_.isFunction(iteratee)) {
	      iteratee = _.negate(iteratee);
	    } else {
	      var keys = _.map(flatten(arguments, false, false, 1), String);
	      iteratee = function(value, key) {
	        return !_.contains(keys, key);
	      };
	    }
	    return _.pick(obj, iteratee, context);
	  };

	  // Fill in a given object with default properties.
	  _.defaults = createAssigner(_.allKeys, true);

	  // Creates an object that inherits from the given prototype object.
	  // If additional properties are provided then they will be added to the
	  // created object.
	  _.create = function(prototype, props) {
	    var result = baseCreate(prototype);
	    if (props) _.extendOwn(result, props);
	    return result;
	  };

	  // Create a (shallow-cloned) duplicate of an object.
	  _.clone = function(obj) {
	    if (!_.isObject(obj)) return obj;
	    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
	  };

	  // Invokes interceptor with the obj, and then returns obj.
	  // The primary purpose of this method is to "tap into" a method chain, in
	  // order to perform operations on intermediate results within the chain.
	  _.tap = function(obj, interceptor) {
	    interceptor(obj);
	    return obj;
	  };

	  // Returns whether an object has a given set of `key:value` pairs.
	  _.isMatch = function(object, attrs) {
	    var keys = _.keys(attrs), length = keys.length;
	    if (object == null) return !length;
	    var obj = Object(object);
	    for (var i = 0; i < length; i++) {
	      var key = keys[i];
	      if (attrs[key] !== obj[key] || !(key in obj)) return false;
	    }
	    return true;
	  };


	  // Internal recursive comparison function for `isEqual`.
	  var eq = function(a, b, aStack, bStack) {
	    // Identical objects are equal. `0 === -0`, but they aren't identical.
	    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
	    if (a === b) return a !== 0 || 1 / a === 1 / b;
	    // A strict comparison is necessary because `null == undefined`.
	    if (a == null || b == null) return a === b;
	    // Unwrap any wrapped objects.
	    if (a instanceof _) a = a._wrapped;
	    if (b instanceof _) b = b._wrapped;
	    // Compare `[[Class]]` names.
	    var className = toString.call(a);
	    if (className !== toString.call(b)) return false;
	    switch (className) {
	      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
	      case '[object RegExp]':
	      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
	      case '[object String]':
	        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
	        // equivalent to `new String("5")`.
	        return '' + a === '' + b;
	      case '[object Number]':
	        // `NaN`s are equivalent, but non-reflexive.
	        // Object(NaN) is equivalent to NaN
	        if (+a !== +a) return +b !== +b;
	        // An `egal` comparison is performed for other numeric values.
	        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
	      case '[object Date]':
	      case '[object Boolean]':
	        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
	        // millisecond representations. Note that invalid dates with millisecond representations
	        // of `NaN` are not equivalent.
	        return +a === +b;
	    }

	    var areArrays = className === '[object Array]';
	    if (!areArrays) {
	      if (typeof a != 'object' || typeof b != 'object') return false;

	      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
	      // from different frames are.
	      var aCtor = a.constructor, bCtor = b.constructor;
	      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
	                               _.isFunction(bCtor) && bCtor instanceof bCtor)
	                          && ('constructor' in a && 'constructor' in b)) {
	        return false;
	      }
	    }
	    // Assume equality for cyclic structures. The algorithm for detecting cyclic
	    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

	    // Initializing stack of traversed objects.
	    // It's done here since we only need them for objects and arrays comparison.
	    aStack = aStack || [];
	    bStack = bStack || [];
	    var length = aStack.length;
	    while (length--) {
	      // Linear search. Performance is inversely proportional to the number of
	      // unique nested structures.
	      if (aStack[length] === a) return bStack[length] === b;
	    }

	    // Add the first object to the stack of traversed objects.
	    aStack.push(a);
	    bStack.push(b);

	    // Recursively compare objects and arrays.
	    if (areArrays) {
	      // Compare array lengths to determine if a deep comparison is necessary.
	      length = a.length;
	      if (length !== b.length) return false;
	      // Deep compare the contents, ignoring non-numeric properties.
	      while (length--) {
	        if (!eq(a[length], b[length], aStack, bStack)) return false;
	      }
	    } else {
	      // Deep compare objects.
	      var keys = _.keys(a), key;
	      length = keys.length;
	      // Ensure that both objects contain the same number of properties before comparing deep equality.
	      if (_.keys(b).length !== length) return false;
	      while (length--) {
	        // Deep compare each member
	        key = keys[length];
	        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
	      }
	    }
	    // Remove the first object from the stack of traversed objects.
	    aStack.pop();
	    bStack.pop();
	    return true;
	  };

	  // Perform a deep comparison to check if two objects are equal.
	  _.isEqual = function(a, b) {
	    return eq(a, b);
	  };

	  // Is a given array, string, or object empty?
	  // An "empty" object has no enumerable own-properties.
	  _.isEmpty = function(obj) {
	    if (obj == null) return true;
	    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
	    return _.keys(obj).length === 0;
	  };

	  // Is a given value a DOM element?
	  _.isElement = function(obj) {
	    return !!(obj && obj.nodeType === 1);
	  };

	  // Is a given value an array?
	  // Delegates to ECMA5's native Array.isArray
	  _.isArray = nativeIsArray || function(obj) {
	    return toString.call(obj) === '[object Array]';
	  };

	  // Is a given variable an object?
	  _.isObject = function(obj) {
	    var type = typeof obj;
	    return type === 'function' || type === 'object' && !!obj;
	  };

	  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
	  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
	    _['is' + name] = function(obj) {
	      return toString.call(obj) === '[object ' + name + ']';
	    };
	  });

	  // Define a fallback version of the method in browsers (ahem, IE < 9), where
	  // there isn't any inspectable "Arguments" type.
	  if (!_.isArguments(arguments)) {
	    _.isArguments = function(obj) {
	      return _.has(obj, 'callee');
	    };
	  }

	  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
	  // IE 11 (#1621), and in Safari 8 (#1929).
	  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
	    _.isFunction = function(obj) {
	      return typeof obj == 'function' || false;
	    };
	  }

	  // Is a given object a finite number?
	  _.isFinite = function(obj) {
	    return isFinite(obj) && !isNaN(parseFloat(obj));
	  };

	  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
	  _.isNaN = function(obj) {
	    return _.isNumber(obj) && obj !== +obj;
	  };

	  // Is a given value a boolean?
	  _.isBoolean = function(obj) {
	    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
	  };

	  // Is a given value equal to null?
	  _.isNull = function(obj) {
	    return obj === null;
	  };

	  // Is a given variable undefined?
	  _.isUndefined = function(obj) {
	    return obj === void 0;
	  };

	  // Shortcut function for checking if an object has a given property directly
	  // on itself (in other words, not on a prototype).
	  _.has = function(obj, key) {
	    return obj != null && hasOwnProperty.call(obj, key);
	  };

	  // Utility Functions
	  // -----------------

	  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
	  // previous owner. Returns a reference to the Underscore object.
	  _.noConflict = function() {
	    root._ = previousUnderscore;
	    return this;
	  };

	  // Keep the identity function around for default iteratees.
	  _.identity = function(value) {
	    return value;
	  };

	  // Predicate-generating functions. Often useful outside of Underscore.
	  _.constant = function(value) {
	    return function() {
	      return value;
	    };
	  };

	  _.noop = function(){};

	  _.property = property;

	  // Generates a function for a given object that returns a given property.
	  _.propertyOf = function(obj) {
	    return obj == null ? function(){} : function(key) {
	      return obj[key];
	    };
	  };

	  // Returns a predicate for checking whether an object has a given set of
	  // `key:value` pairs.
	  _.matcher = _.matches = function(attrs) {
	    attrs = _.extendOwn({}, attrs);
	    return function(obj) {
	      return _.isMatch(obj, attrs);
	    };
	  };

	  // Run a function **n** times.
	  _.times = function(n, iteratee, context) {
	    var accum = Array(Math.max(0, n));
	    iteratee = optimizeCb(iteratee, context, 1);
	    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
	    return accum;
	  };

	  // Return a random integer between min and max (inclusive).
	  _.random = function(min, max) {
	    if (max == null) {
	      max = min;
	      min = 0;
	    }
	    return min + Math.floor(Math.random() * (max - min + 1));
	  };

	  // A (possibly faster) way to get the current timestamp as an integer.
	  _.now = Date.now || function() {
	    return new Date().getTime();
	  };

	   // List of HTML entities for escaping.
	  var escapeMap = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#x27;',
	    '`': '&#x60;'
	  };
	  var unescapeMap = _.invert(escapeMap);

	  // Functions for escaping and unescaping strings to/from HTML interpolation.
	  var createEscaper = function(map) {
	    var escaper = function(match) {
	      return map[match];
	    };
	    // Regexes for identifying a key that needs to be escaped
	    var source = '(?:' + _.keys(map).join('|') + ')';
	    var testRegexp = RegExp(source);
	    var replaceRegexp = RegExp(source, 'g');
	    return function(string) {
	      string = string == null ? '' : '' + string;
	      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
	    };
	  };
	  _.escape = createEscaper(escapeMap);
	  _.unescape = createEscaper(unescapeMap);

	  // If the value of the named `property` is a function then invoke it with the
	  // `object` as context; otherwise, return it.
	  _.result = function(object, property, fallback) {
	    var value = object == null ? void 0 : object[property];
	    if (value === void 0) {
	      value = fallback;
	    }
	    return _.isFunction(value) ? value.call(object) : value;
	  };

	  // Generate a unique integer id (unique within the entire client session).
	  // Useful for temporary DOM ids.
	  var idCounter = 0;
	  _.uniqueId = function(prefix) {
	    var id = ++idCounter + '';
	    return prefix ? prefix + id : id;
	  };

	  // By default, Underscore uses ERB-style template delimiters, change the
	  // following template settings to use alternative delimiters.
	  _.templateSettings = {
	    evaluate    : /<%([\s\S]+?)%>/g,
	    interpolate : /<%=([\s\S]+?)%>/g,
	    escape      : /<%-([\s\S]+?)%>/g
	  };

	  // When customizing `templateSettings`, if you don't want to define an
	  // interpolation, evaluation or escaping regex, we need one that is
	  // guaranteed not to match.
	  var noMatch = /(.)^/;

	  // Certain characters need to be escaped so that they can be put into a
	  // string literal.
	  var escapes = {
	    "'":      "'",
	    '\\':     '\\',
	    '\r':     'r',
	    '\n':     'n',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };

	  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

	  var escapeChar = function(match) {
	    return '\\' + escapes[match];
	  };

	  // JavaScript micro-templating, similar to John Resig's implementation.
	  // Underscore templating handles arbitrary delimiters, preserves whitespace,
	  // and correctly escapes quotes within interpolated code.
	  // NB: `oldSettings` only exists for backwards compatibility.
	  _.template = function(text, settings, oldSettings) {
	    if (!settings && oldSettings) settings = oldSettings;
	    settings = _.defaults({}, settings, _.templateSettings);

	    // Combine delimiters into one regular expression via alternation.
	    var matcher = RegExp([
	      (settings.escape || noMatch).source,
	      (settings.interpolate || noMatch).source,
	      (settings.evaluate || noMatch).source
	    ].join('|') + '|$', 'g');

	    // Compile the template source, escaping string literals appropriately.
	    var index = 0;
	    var source = "__p+='";
	    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
	      source += text.slice(index, offset).replace(escaper, escapeChar);
	      index = offset + match.length;

	      if (escape) {
	        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
	      } else if (interpolate) {
	        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
	      } else if (evaluate) {
	        source += "';\n" + evaluate + "\n__p+='";
	      }

	      // Adobe VMs need the match returned to produce the correct offest.
	      return match;
	    });
	    source += "';\n";

	    // If a variable is not specified, place data values in local scope.
	    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

	    source = "var __t,__p='',__j=Array.prototype.join," +
	      "print=function(){__p+=__j.call(arguments,'');};\n" +
	      source + 'return __p;\n';

	    try {
	      var render = new Function(settings.variable || 'obj', '_', source);
	    } catch (e) {
	      e.source = source;
	      throw e;
	    }

	    var template = function(data) {
	      return render.call(this, data, _);
	    };

	    // Provide the compiled source as a convenience for precompilation.
	    var argument = settings.variable || 'obj';
	    template.source = 'function(' + argument + '){\n' + source + '}';

	    return template;
	  };

	  // Add a "chain" function. Start chaining a wrapped Underscore object.
	  _.chain = function(obj) {
	    var instance = _(obj);
	    instance._chain = true;
	    return instance;
	  };

	  // OOP
	  // ---------------
	  // If Underscore is called as a function, it returns a wrapped object that
	  // can be used OO-style. This wrapper holds altered versions of all the
	  // underscore functions. Wrapped objects may be chained.

	  // Helper function to continue chaining intermediate results.
	  var result = function(instance, obj) {
	    return instance._chain ? _(obj).chain() : obj;
	  };

	  // Add your own custom functions to the Underscore object.
	  _.mixin = function(obj) {
	    _.each(_.functions(obj), function(name) {
	      var func = _[name] = obj[name];
	      _.prototype[name] = function() {
	        var args = [this._wrapped];
	        push.apply(args, arguments);
	        return result(this, func.apply(_, args));
	      };
	    });
	  };

	  // Add all of the Underscore functions to the wrapper object.
	  _.mixin(_);

	  // Add all mutator Array functions to the wrapper.
	  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      var obj = this._wrapped;
	      method.apply(obj, arguments);
	      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
	      return result(this, obj);
	    };
	  });

	  // Add all accessor Array functions to the wrapper.
	  _.each(['concat', 'join', 'slice'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      return result(this, method.apply(this._wrapped, arguments));
	    };
	  });

	  // Extracts the result from a wrapped and chained object.
	  _.prototype.value = function() {
	    return this._wrapped;
	  };

	  // Provide unwrapping proxy for some methods used in engine operations
	  // such as arithmetic and JSON stringification.
	  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

	  _.prototype.toString = function() {
	    return '' + this._wrapped;
	  };

	  // AMD registration happens at the end for compatibility with AMD loaders
	  // that may not enforce next-turn semantics on modules. Even though general
	  // practice for AMD registration is to be anonymous, underscore registers
	  // as a named module because, like jQuery, it is a base library that is
	  // popular enough to be bundled in a third party lib, but not be part of
	  // an AMD load request. Those cases could generate an error when an
	  // anonymous define() is called outside of a loader request.
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return _;
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}.call(this));


/***/ }
/******/ ])));