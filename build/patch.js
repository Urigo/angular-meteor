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
var meteor_1 = require('meteor/meteor');
var tracker_1 = require('meteor/tracker');
var mongo_1 = require('meteor/mongo');
var utils_1 = require('./utils');
var tHandler = null;
var zones = [];
var runZonesTask = null;
function runZones() {
    for (var _i = 0, zones_1 = zones; _i < zones_1.length; _i++) {
        var zone = zones_1[_i];
        zone.run(lang_1.noop);
    }
    zones = [];
}
exports.runZones = runZones;
function saveZone() {
    if (utils_1.g.Zone.current !== utils_1.gZone &&
        zones.indexOf(utils_1.g.Zone.current) === -1) {
        zones.push(utils_1.g.Zone.current);
    }
}
function scheduleZonesRun() {
    if (runZonesTask) {
        runZonesTask.cancelFn();
        runZonesTask = null;
    }
    runZonesTask = utils_1.gZone.scheduleMacroTask('runZones', runZones, null, function (task) {
        tHandler = setTimeout(task.invoke);
    }, function () {
        clearTimeout(tHandler);
        runZonesTask = null;
    });
}
function wrapInZone(method, context) {
    saveZone();
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        utils_1.gZone.run(function () {
            method.apply(context, args);
        });
        scheduleZonesRun();
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
var trackerAutorun = tracker_1.Tracker.autorun;
var meteorSubscribe = meteor_1.Meteor.subscribe;
var meteorCall = meteor_1.Meteor.call;
var mongoObserve = mongo_1.Mongo.Cursor.prototype.observe;
var mongoObserveChanges = mongo_1.Mongo.Cursor.prototype.observeChanges;
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
    tracker_1.Tracker.autorun = patchTrackerAutorun(tracker_1.Tracker.autorun);
    meteor_1.Meteor.subscribe = patchMeteorSubscribe(meteor_1.Meteor.subscribe);
    meteor_1.Meteor.call = patchMeteorCall(meteor_1.Meteor.call);
    mongo_1.Mongo.Cursor.prototype.observe = patchCursorObserve(mongo_1.Mongo.Cursor.prototype.observe);
    mongo_1.Mongo.Cursor.prototype.observeChanges = patchCursorObserveChanges(mongo_1.Mongo.Cursor.prototype.observeChanges);
}
exports.patchMeteor = patchMeteor;
;
function unpatchMeteor() {
    tracker_1.Tracker.autorun = trackerAutorun;
    meteor_1.Meteor.subscribe = meteorSubscribe;
    meteor_1.Meteor.call = meteorCall;
    mongo_1.Mongo.Cursor.prototype.observe = mongoObserve;
    mongo_1.Mongo.Cursor.prototype.observeChanges = mongoObserveChanges;
}
exports.unpatchMeteor = unpatchMeteor;
;
patchMeteor();
