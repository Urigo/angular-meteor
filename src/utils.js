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
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	exports.subscribeEvents = ['onReady', 'onError', 'onStop'];
	function isMeteorCallbacks(callbacks) {
	    return _.isFunction(callbacks) || isCallbacksObject(callbacks);
	}
	exports.isMeteorCallbacks = isMeteorCallbacks;
	// Checks if callbacks of {@link CallbacksObject} type.
	function isCallbacksObject(callbacks) {
	    return callbacks && exports.subscribeEvents.some(function (event) {
	        return _.isFunction(callbacks[event]);
	    });
	}
	exports.isCallbacksObject = isCallbacksObject;
	;
	function newPromise() {
	    var args = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        args[_i - 0] = arguments[_i];
	    }
	    var constructor = Promise || (global && global.Promise);
	    if (constructor) {
	        return new constructor(args[0]);
	    }
	    throw new Error('Promise is not defined');
	}
	exports.newPromise = newPromise;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
/******/ ])));