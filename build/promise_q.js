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

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";
	var utils_1 = __webpack_require__(9);
	var promise_1 = __webpack_require__(13);
	Promise = Promise || (global && global.Promise);
	var PromiseQ = (function () {
	    function PromiseQ() {
	    }
	    PromiseQ.wrapPush = function (callbacks) {
	        var _this = this;
	        check(callbacks, Match.Where(utils_1.isMeteorCallbacks));
	        var completer = promise_1.PromiseWrapper.completer();
	        var dequeue = function (promise) {
	            var index = _this._promises.indexOf(promise);
	            if (index !== -1) {
	                _this._promises.splice(index, 1);
	            }
	        };
	        var queue = function (promise) {
	            _this._promises.push(promise);
	        };
	        var promise = completer.promise;
	        if (utils_1.isCallbacksObject(callbacks)) {
	            var origin_1 = callbacks;
	            var object = {
	                onError: function (err) {
	                    origin_1.onError(err);
	                    completer.resolve({ err: err });
	                    dequeue(promise);
	                },
	                onReady: function (result) {
	                    origin_1.onReady(result);
	                    completer.resolve({ result: result });
	                    dequeue(promise);
	                },
	                onStop: function (err) {
	                    origin_1.onStop(err);
	                    completer.resolve({ err: err });
	                    dequeue(promise);
	                }
	            };
	            queue(promise);
	            return object;
	        }
	        var newCallback = function (err, result) {
	            callbacks(err, result);
	            completer.resolve({ err: err, result: result });
	            dequeue(promise);
	        };
	        queue(promise);
	        return newCallback;
	    };
	    PromiseQ.onAll = function (resolve) {
	        Promise.all(this._promises).then(resolve);
	    };
	    PromiseQ.len = function () {
	        return this._promises.length;
	    };
	    PromiseQ._promises = [];
	    return PromiseQ;
	}());
	exports.PromiseQ = PromiseQ;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },

/***/ 9:
/***/ function(module, exports) {

	module.exports = require("./utils");

/***/ },

/***/ 13:
/***/ function(module, exports) {

	module.exports = require("angular2/src/facade/promise");

/***/ }

/******/ })));