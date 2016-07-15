'use strict';
var lang_1 = require('@angular/core/src/facade/lang');
var utils_1 = require('./utils');
var data_observer_1 = require('./data_observer');
/**
 * A class to extend in Angular 2 components.
 * Contains wrappers over main Meteor methods,
 * that does some maintenance work behind the scene.
 * For example, it destroys subscription handles
 * when the component is being destroyed itself.
 */
var MeteorComponent = (function () {
    function MeteorComponent() {
        this._hAutoruns = [];
        this._hSubscribes = [];
        this._ngZone = utils_1.g.Zone.current;
    }
    /**
     * Method has the same notation as Meteor.autorun
     * except the last parameter.
     * @param func Callback to be executed when
     *   current computation is invalidated.
     * @param autoBind Determine whether Angular 2 zone will run
     *   after the func call to initiate change detection.
     */
    MeteorComponent.prototype.autorun = function (func, autoBind) {
        if (autoBind === void 0) { autoBind = true; }
        var autorunCall = function () {
            return Tracker.autorun(func);
        };
        // If autoBind is set to false then
        // we run Meteor method in the global zone
        // instead of the current Angular 2 zone.
        var zone = autoBind ? this._ngZone : utils_1.gZone;
        var hAutorun = zone.run(autorunCall);
        this._hAutoruns.push(hAutorun);
        return hAutorun;
    };
    /**
     *  Method has the same notation as Meteor.subscribe:
     *    subscribe(name, [args1, args2], [callbacks], [autoBind])
     *  except the last autoBind param (see autorun above).
     */
    MeteorComponent.prototype.subscribe = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _a = this._prepArgs(args), pargs = _a.pargs, autoBind = _a.autoBind;
        if (!Meteor.subscribe) {
            throw new Error('Meteor.subscribe is not defined on the server side');
        }
        ;
        var subscribeCall = function () {
            return Meteor.subscribe.apply(Meteor, [name].concat(pargs));
        };
        var zone = autoBind ? this._ngZone : utils_1.gZone;
        var hSubscribe = zone.run(subscribeCall);
        if (Meteor.isClient) {
            this._hSubscribes.push(hSubscribe);
        }
        ;
        if (Meteor.isServer) {
            var callback = pargs[pargs.length - 1];
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
        var _a = this._prepArgs(args), pargs = _a.pargs, autoBind = _a.autoBind;
        var meteorCall = function () {
            Meteor.call.apply(Meteor, [name].concat(pargs));
        };
        var zone = autoBind ? this._ngZone : utils_1.gZone;
        return zone.run(meteorCall);
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
        var autoBind = true;
        if (_.isBoolean(lastParam) &&
            utils_1.isMeteorCallbacks(penultParam)) {
            args.pop();
            autoBind = lastParam !== false;
        }
        lastParam = args[args.length - 1];
        if (utils_1.isMeteorCallbacks(lastParam)) {
            // Push callback to the observer, so
            // that we can use onReady to know when
            // data is loaded. 
            args[args.length - 1] = data_observer_1.DataObserver.pushCb(lastParam);
        }
        else {
            args.push(data_observer_1.DataObserver.pushCb(lang_1.noop));
        }
        return { pargs: args, autoBind: autoBind };
    };
    return MeteorComponent;
}());
exports.MeteorComponent = MeteorComponent;
