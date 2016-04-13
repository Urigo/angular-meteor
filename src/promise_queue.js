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

	"use strict";
	var utils_1 = __webpack_require__(9);
	var PromiseQueue = (function () {
	    function PromiseQueue() {
	    }
	    PromiseQueue.wrap = function (callbacks) {
	        check(callbacks, Match.Where(utils_1.isMeteorCallbacks));
	        if (utils_1.isCallbacksObject(callbacks)) {
	            var calObject_1 = callbacks;
	            var object_1 = {};
	            var promise_1 = utils_1.newPromise(function (resolve, reject) {
	                object_1.onReady = function (result) {
	                    calObject_1.onReady(result);
	                    resolve({ result: result });
	                };
	                object_1.onError = function (err) {
	                    calObject_1.onError(err);
	                    resolve({ err: err });
	                };
	                object_1.onStop = function (err) {
	                    calObject_1.onStop(err);
	                    resolve({ err: err });
	                };
	                var index = PromiseQueue._promises.indexOf(promise_1);
	                if (index !== -1) {
	                    PromiseQueue._promises.splice(index, 1);
	                }
	            });
	            PromiseQueue._promises.push(promise_1);
	            return object_1;
	        }
	        var newCallback;
	        var promise = utils_1.newPromise(function (resolve, reject) {
	            var callback = callbacks;
	            newCallback = function (err, result) {
	                callback(err, result);
	                resolve({ err: err, result: result });
	                var index = PromiseQueue._promises.indexOf(promise);
	                if (index !== -1) {
	                    PromiseQueue._promises.splice(index, 1);
	                }
	            };
	        });
	        PromiseQueue._promises.push(promise);
	        return newCallback;
	    };
	    PromiseQueue.onResolve = function (resolve) {
	        Promise.all(PromiseQueue._promises).then(resolve);
	    };
	    PromiseQueue.len = function () {
	        return PromiseQueue._promises.length;
	    };
	    PromiseQueue._promises = [];
	    return PromiseQueue;
	}());
	exports.PromiseQueue = PromiseQueue;


/***/ },

/***/ 9:
/***/ function(module, exports) {

	module.exports = require("./utils");

/***/ }

/******/ })));