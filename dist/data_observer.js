'use strict';
var utils_1 = require('./utils');
/**
 * A helper class for data loading events.
 * For example, used in @MeteorComponent to wrap callbacks
 * of the Meteor methods whic allows us to know when
 * requested data is available on the client.
 */
var DataObserver = (function () {
    function DataObserver() {
    }
    DataObserver.pushCb = function (callbacks) {
        var _this = this;
        utils_1.check(callbacks, utils_1.Match.Where(utils_1.isMeteorCallbacks));
        var dequeue = function (promise) {
            var index = _this._promises.indexOf(promise);
            if (index !== -1) {
                _this._promises.splice(index, 1);
            }
        };
        var queue = function (promise) {
            _this._promises.push(promise);
        };
        if (utils_1.isCallbacksObject(callbacks)) {
            var origin_1 = callbacks;
            var newCallbacks_1;
            var promise_1 = new Promise(function (resolve) {
                newCallbacks_1 = {
                    onError: function (err) {
                        if (origin_1.onError) {
                            origin_1.onError(err);
                        }
                        resolve({ err: err });
                        dequeue(promise_1);
                    },
                    onReady: function (result) {
                        if (origin_1.onReady) {
                            origin_1.onReady(result);
                        }
                        resolve({ result: result });
                        dequeue(promise_1);
                    },
                    onStop: function (err) {
                        if (origin_1.onStop) {
                            origin_1.onStop(err);
                        }
                        resolve({ err: err });
                        dequeue(promise_1);
                    }
                };
            });
            queue(promise_1);
            return newCallbacks_1;
        }
        var newCallback;
        var promise = new Promise(function (resolve) {
            newCallback = function (err, result) {
                callbacks(err, result);
                resolve({ err: err, result: result });
                dequeue(promise);
            };
        });
        queue(promise);
        return newCallback;
    };
    DataObserver.onSubsReady = function (cb) {
        utils_1.check(cb, Function);
        new Promise(function (resolve, reject) {
            var poll = Meteor.setInterval(function () {
                if (DDP._allSubscriptionsReady()) {
                    Meteor.clearInterval(poll);
                    resolve();
                }
            }, 100);
        }).then(function () { return cb(); });
    };
    DataObserver.onReady = function (cb) {
        utils_1.check(cb, Function);
        Promise.all(this._promises).then(function () { return cb(); });
    };
    DataObserver.cbLen = function () {
        return this._promises.length;
    };
    DataObserver._promises = [];
    return DataObserver;
}());
exports.DataObserver = DataObserver;
