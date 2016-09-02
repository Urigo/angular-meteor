'use strict';
/**
 * Contains a set of methods to schedule Zone runs.
 * Supposed to be used mostly in @MeteorReactive to patch
 * Meteor methods' callbacks.
 * After patching, callbacks will be run in the global zone
 * (i.e. outside of Angular 2), at the same time,
 * a Angular 2 zone run will be scheduled in order to
 * initiate UI update. In order to reduce number of
 * UI updates caused by the callbacks near the same time,
 * zone runs are debounced.
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
function wrapFuncInZone(zone, method, context) {
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
function wrapCallbackInZone(zone, callback, context) {
    if (_.isFunction(callback)) {
        return wrapFuncInZone(zone, callback, context);
    }
    for (var _i = 0, _a = _.functions(callback); _i < _a.length; _i++) {
        var fn = _a[_i];
        callback[fn] = wrapFuncInZone(zone, callback[fn], context);
    }
    return callback;
}
exports.wrapCallbackInZone = wrapCallbackInZone;
