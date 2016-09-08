'use strict';
/**
 * Patches Meteor methods to watch for the data exchange
 * (with the help of @DataObserver) between the client and server.
 * Primarily to be used in the Angular 2 Universal integration,
 * which needs to know when requested data is available
 * on the client to start bootstraping.
 */
var utils_1 = require('./utils');
var data_observer_1 = require('./data_observer');
// Save original methods.
var meteorSubscribe = Meteor.subscribe;
var meteorCall = Meteor.call;
function patchMeteorSubscribe(subscribe) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var callback = args[args.length - 1];
        if (utils_1.isMeteorCallbacks(callback)) {
            args[args.length - 1] = data_observer_1.DataObserver.pushCb(callback);
        }
        else {
            args.push(data_observer_1.DataObserver.pushCb(utils_1.noop));
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
            args[args.length - 1] = data_observer_1.DataObserver.pushCb(callback);
        }
        else {
            args.push(data_observer_1.DataObserver.pushCb(utils_1.noop));
        }
        return call.apply(this, args);
    };
}
exports.patchMeteorCall = patchMeteorCall;
function patchMeteor() {
    Meteor.subscribe = patchMeteorSubscribe(Meteor.subscribe);
    Meteor.call = patchMeteorCall(Meteor.call);
}
exports.patchMeteor = patchMeteor;
;
function unpatchMeteor() {
    Meteor.subscribe = meteorSubscribe;
    Meteor.call = meteorCall;
}
exports.unpatchMeteor = unpatchMeteor;
;
patchMeteor();
