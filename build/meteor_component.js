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

	'use strict';
	var core_1 = __webpack_require__(5);
	var utils_1 = __webpack_require__(9);
	var promise_q_1 = __webpack_require__(8);
	var MeteorComponent = (function () {
	    /**
	     * @param {NgZone} ngZone added for test purposes mostly.
	     */
	    function MeteorComponent(ngZone) {
	        this._hAutoruns = [];
	        this._hSubscribes = [];
	        this._zone = ngZone || core_1.createNgZone();
	    }
	    MeteorComponent.prototype.autorun = function (func, autoBind) {
	        var hAutorun = Tracker.autorun(autoBind ? this._bindToNgZone(func) : func);
	        this._hAutoruns.push(hAutorun);
	        return hAutorun;
	    };
	    /**
	     *  Method has the same notation as Meteor.subscribe:
	     *    subscribe(name, [args1, args2], [callbacks], [autobind])
	     *  except one additional last parameter,
	     *  which binds [callbacks] to the ng2 zone.
	     */
	    MeteorComponent.prototype.subscribe = function (name) {
	        var args = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            args[_i - 1] = arguments[_i];
	        }
	        var subArgs = this._prepMeteorArgs(args.slice());
	        if (!Meteor.subscribe) {
	            throw new Error('Meteor.subscribe is not defined on the server side');
	        }
	        ;
	        var hSubscribe = Meteor.subscribe.apply(Meteor, [name].concat(subArgs));
	        if (Meteor.isClient) {
	            this._hSubscribes.push(hSubscribe);
	        }
	        ;
	        if (Meteor.isServer) {
	            var callback = subArgs[subArgs.length - 1];
	            if (_.isFunction(callback)) {
	                callback();
	            }
	            if (utils_1.isCallbacksObject(callback)) {
	                callback.onReady();
	            }
	        }
	        return hSubscribe;
	    };
	    MeteorComponent.prototype.call = function (name) {
	        var args = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            args[_i - 1] = arguments[_i];
	        }
	        var callArgs = this._prepMeteorArgs(args.slice());
	        return Meteor.call.apply(Meteor, [name].concat(callArgs));
	    };
	    MeteorComponent.prototype._prepMeteorArgs = function (args) {
	        var lastParam = args[args.length - 1];
	        var penultParam = args[args.length - 2];
	        if (_.isBoolean(lastParam) && utils_1.isMeteorCallbacks(penultParam)) {
	            var callbacks = penultParam;
	            var autobind = lastParam;
	            if (autobind) {
	                args[args.length - 2] = this._bindToNgZone(callbacks);
	            }
	            // Removes last params since its specific to MeteorComponent.
	            args.pop();
	        }
	        if (utils_1.isMeteorCallbacks(args[args.length - 1])) {
	            args[args.length - 1] = promise_q_1.PromiseQ.wrapPush(args[args.length - 1]);
	        }
	        return args;
	    };
	    MeteorComponent.prototype.ngOnDestroy = function () {
	        for (var _i = 0, _a = this._hAutoruns; _i < _a.length; _i++) {
	            var hAutorun = _a[_i];
	            hAutorun.stop();
	        }
	        for (var _b = 0, _c = this._hSubscribes; _b < _c.length; _b++) {
	            var hSubscribe = _c[_b];
	            hSubscribe.stop();
	        }
	        this._hAutoruns = null;
	        this._hSubscribes = null;
	    };
	    MeteorComponent.prototype._bindToNgZone = function (callbacks) {
	        var self = this;
	        if (_.isFunction(callbacks)) {
	            return function () {
	                var args = [];
	                for (var _i = 0; _i < arguments.length; _i++) {
	                    args[_i - 0] = arguments[_i];
	                }
	                self._zone.run(function () { return callbacks.apply(self._zone, args); });
	            };
	        }
	        if (utils_1.isCallbacksObject(callbacks)) {
	            // Bind zone for each event.
	            var newCallbacks_1 = _.clone(callbacks);
	            utils_1.subscribeEvents.forEach(function (event) {
	                if (newCallbacks_1[event]) {
	                    newCallbacks_1[event] = function () {
	                        var args = [];
	                        for (var _i = 0; _i < arguments.length; _i++) {
	                            args[_i - 0] = arguments[_i];
	                        }
	                        self._zone.run(function () { return callbacks[event].apply(self._zone, args); });
	                    };
	                }
	            });
	            return newCallbacks_1;
	        }
	        return callbacks;
	    };
	    return MeteorComponent;
	}());
	exports.MeteorComponent = MeteorComponent;


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports) {

	module.exports = require("angular2/core");

/***/ },
/* 6 */,
/* 7 */,
/* 8 */
/***/ function(module, exports) {

	module.exports = require("./promise_q");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("./utils");

/***/ }
/******/ ])));