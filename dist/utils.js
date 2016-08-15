'use strict';
exports.subscribeEvents = ['onReady', 'onError', 'onStop'];
function isMeteorCallbacks(callbacks) {
    return _.isFunction(callbacks) || isCallbacksObject(callbacks);
}
exports.isMeteorCallbacks = isMeteorCallbacks;
// Checks if callbacks of {@link CallbacksObject} type.
function isCallbacksObject(callbacks) {
    return callbacks && exports.subscribeEvents.some(function (event) {
        return _.isFunction(callbacks[event]);
    });
}
exports.isCallbacksObject = isCallbacksObject;
;
exports.g = typeof global === 'object' ? global :
    typeof window === 'object' ? window :
        typeof self === 'object' ? self : this;
exports.gZone = exports.g.Zone.current;
exports.EJSON = Package['ejson'].EJSON;
exports.check = Package['check'].check;
exports.Match = Package['check'].Match;
function debounce(func, wait, onInit) {
    var timeout, result, data;
    var later = function (context, args) {
        timeout = null;
        result = func.apply(context, args.concat([data]));
    };
    var debounced = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (!timeout) {
            data = onInit && onInit();
        }
        if (timeout)
            clearTimeout(timeout);
        timeout = _.delay(later, wait, this, args);
        return result;
    };
    return debounced;
}
exports.debounce = debounce;
;
