'use strict';
var core_1 = require('@angular/core');
var meteor_1 = require('meteor/meteor');
var tracker_1 = require('meteor/tracker');
var utils_1 = require('./utils');
var promise_q_1 = require('./promise_q');
var meteor_app_1 = require('./meteor_app');
var MeteorComponent = (function () {
    function MeteorComponent() {
        var _this = this;
        this._hAutoruns = [];
        this._hSubscribes = [];
        this._zone = meteor_app_1.MeteorApp.ngZone() || core_1.createNgZone();
        this._zone.onUnstable.subscribe(function () { return _this._inZone = true; });
        this._zone.onMicrotaskEmpty.subscribe(function () { return _this._inZone = false; });
    }
    MeteorComponent.prototype.autorun = function (func, autoBind) {
        var hAutorun = tracker_1.Tracker.autorun(autoBind ? this._bindToNgZone(func) : func);
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
        if (!meteor_1.Meteor.subscribe) {
            throw new Error('Meteor.subscribe is not defined on the server side');
        }
        ;
        var hSubscribe = meteor_1.Meteor.subscribe.apply(meteor_1.Meteor, [name].concat(subArgs));
        if (meteor_1.Meteor.isClient) {
            this._hSubscribes.push(hSubscribe);
        }
        ;
        if (meteor_1.Meteor.isServer) {
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
        return meteor_1.Meteor.call.apply(meteor_1.Meteor, [name].concat(callArgs));
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
    MeteorComponent.prototype._runInZone = function (f) {
        if (!this._inZone) {
            this._zone.run(f);
        }
    };
    MeteorComponent.prototype._bindToNgZone = function (callbacks) {
        var self = this;
        if (_.isFunction(callbacks)) {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                self._runInZone(callbacks.bind(self._zone, args));
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
                        self._runInZone(callbacks[event].bind(self._zone, args));
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
