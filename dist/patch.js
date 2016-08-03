'use strict';
/**
 * Contains a set of methods used to patch original Meteor methods.
 * After patching, callback parameters are run in the global zone
 * (i.e. outside of Angular2). Also, each callback schedules
 * Angular2 zones run (one per each app) in order to initiate
 * change detection cycles.
 * Scheduling happens in a way to reduce number of zone runs
 * since multiple callbacks can be run near the same time.
 */
var lang_1 = require('@angular/core/src/facade/lang');
var utils_1 = require('./utils');
var ZoneRunScheduler = (function () {
    function ZoneRunScheduler() {
        this._zoneTasks = new Map();
        this._onRunCbs = new Map();
    }
    ZoneRunScheduler.prototype.zoneRun = function (zone) {
        var _this = this;
        return function () {
            zone.run(lang_1.noop);
            _this._runAfterRunCbs(zone);
            _this._zoneTasks.delete(zone);
        };
    };
    ZoneRunScheduler.prototype.runZones = function () {
        this._zoneTasks.forEach(function (task, zone) {
            task.invoke();
        });
    };
    ZoneRunScheduler.prototype._runAfterRunCbs = function (zone) {
        if (this._onRunCbs.has(zone)) {
            var cbs = this._onRunCbs.get(zone);
            while (cbs.length !== 0) {
                (cbs.pop())();
            }
            this._onRunCbs.delete(zone);
        }
    };
    ZoneRunScheduler.prototype.scheduleRun = function (zone) {
        if (zone === utils_1.gZone) {
            return;
        }
        var runTask = this._zoneTasks.get(zone);
        if (runTask) {
            runTask.cancelFn(runTask);
            this._zoneTasks.delete(zone);
        }
        runTask = utils_1.gZone.scheduleMacroTask('runZones', this.zoneRun(zone), { isPeriodic: true }, function (task) {
            task._tHandler = setTimeout(task.invoke);
        }, function (task) {
            clearTimeout(task._tHandler);
        });
        this._zoneTasks.set(zone, runTask);
    };
    ZoneRunScheduler.prototype.onAfterRun = function (zone, cb) {
        utils_1.check(cb, Function);
        if (!this._zoneTasks.has(zone)) {
            cb();
            return;
        }
        var cbs = this._onRunCbs.get(zone);
        if (!cbs) {
            cbs = [];
            this._onRunCbs.set(zone, cbs);
        }
        cbs.push(cb);
    };
    return ZoneRunScheduler;
}());
exports.ZoneRunScheduler = ZoneRunScheduler;
exports.zoneRunScheduler = new ZoneRunScheduler();
function wrapInZone(method, context) {
    var zone = utils_1.g.Zone.current;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        utils_1.gZone.run(function () {
            method.apply(context, args);
        });
        exports.zoneRunScheduler.scheduleRun(zone);
    };
}
function wrapCallback(callback, context) {
    if (_.isFunction(callback)) {
        return wrapInZone(callback, context);
    }
    for (var _i = 0, _a = _.functions(callback); _i < _a.length; _i++) {
        var fn = _a[_i];
        callback[fn] = wrapInZone(callback[fn], context);
    }
    return callback;
}
// Save original methods.
var trackerAutorun = Tracker.autorun;
var meteorSubscribe = Meteor.subscribe;
var meteorCall = Meteor.call;
var mongoObserve = Mongo.Cursor.prototype.observe;
var mongoObserveChanges = Mongo.Cursor.prototype.observeChanges;
function patchTrackerAutorun(autorun) {
    return function (runFunc, options) {
        runFunc = wrapCallback(runFunc, this);
        var params = lang_1.isPresent(options) ? [runFunc, options] : [runFunc];
        return autorun.apply(this, params);
    };
}
exports.patchTrackerAutorun = patchTrackerAutorun;
;
function patchMeteorSubscribe(subscribe) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var callback = args[args.length - 1];
        if (utils_1.isMeteorCallbacks(callback)) {
            args[args.length - 1] = wrapCallback(callback, this);
        }
        return subscribe.apply(this, args);
    };
}
exports.patchMeteorSubscribe = patchMeteorSubscribe;
;
function patchMeteorCall(call) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var callback = args[args.length - 1];
        if (utils_1.isMeteorCallbacks(callback)) {
            args[args.length - 1] = wrapCallback(callback, this);
        }
        call.apply(this, args);
    };
}
exports.patchMeteorCall = patchMeteorCall;
function patchCursorObserve(observe) {
    return function (callbacks) {
        callbacks = wrapCallback(callbacks, this);
        return observe.call(this, callbacks);
    };
}
exports.patchCursorObserve = patchCursorObserve;
;
function patchCursorObserveChanges(observeChanges) {
    return function (callbacks) {
        callbacks = wrapCallback(callbacks, this);
        return observeChanges.call(this, callbacks);
    };
}
exports.patchCursorObserveChanges = patchCursorObserveChanges;
function patchMeteor() {
    Tracker.autorun = patchTrackerAutorun(Tracker.autorun);
    Meteor.subscribe = patchMeteorSubscribe(Meteor.subscribe);
    Meteor.call = patchMeteorCall(Meteor.call);
    Mongo.Cursor.prototype.observe = patchCursorObserve(Mongo.Cursor.prototype.observe);
    Mongo.Cursor.prototype.observeChanges = patchCursorObserveChanges(Mongo.Cursor.prototype.observeChanges);
}
exports.patchMeteor = patchMeteor;
;
function unpatchMeteor() {
    Tracker.autorun = trackerAutorun;
    Meteor.subscribe = meteorSubscribe;
    Meteor.call = meteorCall;
    Mongo.Cursor.prototype.observe = mongoObserve;
    Mongo.Cursor.prototype.observeChanges = mongoObserveChanges;
}
exports.unpatchMeteor = unpatchMeteor;
;
patchMeteor();
