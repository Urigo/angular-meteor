'use strict';
var meteor_1 = require('meteor/meteor');
var tracker_1 = require('meteor/tracker');
var utils_1 = require('./utils');
var promise_q_1 = require('./promise_q');
var MeteorComponent = (function () {
    function MeteorComponent() {
        this._hAutoruns = [];
        this._hSubscribes = [];
    }
    MeteorComponent.prototype.autorun = function (func) {
        var hAutorun = tracker_1.Tracker.autorun(func);
        this._hAutoruns.push(hAutorun);
        return hAutorun;
    };
    /**
     *  Method has the same notation as Meteor.subscribe:
     *    subscribe(name, [args1, args2], [callbacks])
     */
    MeteorComponent.prototype.subscribe = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var subArgs = this._prepArgs(args);
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
        var callArgs = this._prepArgs(args);
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
    MeteorComponent.prototype._prepArgs = function (args) {
        var lastParam = args[args.length - 1];
        var penultParam = args[args.length - 2];
        // To be backward compatible.
        if (_.isBoolean(lastParam) &&
            utils_1.isMeteorCallbacks(penultParam)) {
            args.pop();
        }
        lastParam = args[args.length - 1];
        if (utils_1.isMeteorCallbacks(lastParam)) {
            args[args.length - 1] = promise_q_1.PromiseQ.wrapPush(lastParam);
        }
        return args;
    };
    return MeteorComponent;
}());
exports.MeteorComponent = MeteorComponent;
