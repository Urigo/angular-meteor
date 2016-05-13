'use strict';
var lang_1 = require('@angular/core/src/facade/lang');
var meteor_1 = require('meteor/meteor');
var tracker_1 = require('meteor/tracker');
var mongo_1 = require('meteor/mongo');
var utils_1 = require('./utils');
var tHandler = null;
var zones = [];
function runZones() {
    for (var _i = 0, zones_1 = zones; _i < zones_1.length; _i++) {
        var zone = zones_1[_i];
        zone.run(lang_1.noop);
    }
    zones = [];
}
function saveZone() {
    if (utils_1.g.Zone.current !== utils_1.gZone &&
        zones.indexOf(utils_1.g.Zone.current) === -1) {
        zones.push(utils_1.g.Zone.current);
    }
}
var runZonesTask;
function scheduleZonesRun() {
    if (runZonesTask) {
        runZonesTask.cancelFn();
    }
    runZonesTask = utils_1.gZone.scheduleMacroTask('runZones', runZones, null, function (task) {
        tHandler = setTimeout(task.invoke);
    }, function () {
        clearTimeout(tHandler);
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
var autorun = tracker_1.Tracker.autorun;
function TrackerAutorun(runFunc, options) {
    runFunc = wrapCallback(runFunc, this);
    return autorun.call(this, runFunc, options);
}
exports.TrackerAutorun = TrackerAutorun;
;
tracker_1.Tracker.autorun = TrackerAutorun;
var subscribe = meteor_1.Meteor.subscribe;
function MeteorSubscribe() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    var callback = args[args.length - 1];
    if (utils_1.isMeteorCallbacks(callback)) {
        args[args.length - 1] = wrapCallback(callback, this);
    }
    return subscribe.apply(this, args);
}
exports.MeteorSubscribe = MeteorSubscribe;
;
meteor_1.Meteor.subscribe = MeteorSubscribe;
var call = meteor_1.Meteor.call;
function MeteorCall() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    var callback = args[args.length - 1];
    if (utils_1.isMeteorCallbacks(callback)) {
        args[args.length - 1] = wrapCallback(callback, this);
    }
    call.apply(this, args);
}
exports.MeteorCall = MeteorCall;
;
meteor_1.Meteor.call = MeteorCall;
var observe = mongo_1.Mongo.Cursor.prototype.observe;
function CursorObserve(callbacks) {
    callbacks = wrapCallback(callbacks, this);
    return observe.call(this, callbacks);
}
exports.CursorObserve = CursorObserve;
;
mongo_1.Mongo.Cursor.prototype.observe = CursorObserve;
var observeChanges = mongo_1.Mongo.Cursor.prototype.observeChanges;
function CursorObserveChanges(callbacks) {
    callbacks = wrapCallback(callbacks, this);
    return observeChanges.call(this, callbacks);
}
exports.CursorObserveChanges = CursorObserveChanges;
;
mongo_1.Mongo.Cursor.prototype.observeChanges = CursorObserveChanges;
