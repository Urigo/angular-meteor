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
