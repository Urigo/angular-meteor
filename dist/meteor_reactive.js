'use strict';
var utils_1 = require('./utils');
var zone_utils_1 = require('./zone_utils');
/**
 * A basic class to extend @Component and @Pipe.
 * Contains wrappers over main Meteor methods
 * that does some maintenance work behind the scene:
 * - Destroys subscription handles
 *   when the component or pipe is destroyed by Angular 2.
 * - Debounces ngZone runs reducing number of
 *   change detection runs.
 */
var MeteorReactive = (function () {
    function MeteorReactive() {
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
    MeteorReactive.prototype.autorun = function (func, autoBind) {
        if (autoBind === void 0) { autoBind = true; }
        var hAutorun = Tracker.autorun(func);
        this._hAutoruns.push(hAutorun);
        return hAutorun;
    };
    /**
     *  Method has the same notation as Meteor.subscribe:
     *    subscribe(name, [args1, args2], [callbacks], [autoBind])
     *  except the last autoBind param (see autorun above).
     */
    MeteorReactive.prototype.subscribe = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _a = this._prepArgs(args), pargs = _a.pargs, autoBind = _a.autoBind;
        if (!Meteor.subscribe) {
            throw new Error('Meteor.subscribe is not defined on the server side');
        }
        ;
        var hSubscribe = Meteor.subscribe.apply(Meteor, [name].concat(pargs));
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
    MeteorReactive.prototype.call = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _a = this._prepArgs(args), pargs = _a.pargs, autoBind = _a.autoBind;
        return Meteor.call.apply(Meteor, [name].concat(pargs));
    };
    MeteorReactive.prototype.ngOnDestroy = function () {
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
    MeteorReactive.prototype._prepArgs = function (args) {
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
            args.pop();
        }
        else {
            lastParam = utils_1.noop;
        }
        // If autoBind is set to false then
        // we run user's callback in the global zone
        // instead of the current Angular 2 zone.
        var zone = autoBind ? this._ngZone : utils_1.gZone;
        lastParam = zone_utils_1.wrapCallbackInZone(zone, lastParam, this);
        args.push(lastParam);
        return { pargs: args, autoBind: autoBind };
    };
    return MeteorReactive;
}());
exports.MeteorReactive = MeteorReactive;
// For the versions compatibility.
exports.MeteorComponent = MeteorReactive;
