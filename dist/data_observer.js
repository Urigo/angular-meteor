'use strict';
var async_1 = require('@angular/core/src/facade/async');
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
        var completer = async_1.PromiseWrapper.completer();
        var dequeue = function (promise) {
            var index = _this._promises.indexOf(promise);
            if (index !== -1) {
                _this._promises.splice(index, 1);
            }
        };
        var queue = function (promise) {
            _this._promises.push(promise);
        };
        var promise = completer.promise;
        if (utils_1.isCallbacksObject(callbacks)) {
            var origin_1 = callbacks;
            var object = {
                onError: function (err) {
                    if (origin_1.onError) {
                        origin_1.onError(err);
                    }
                    completer.resolve({ err: err });
                    dequeue(promise);
                },
                onReady: function (result) {
                    if (origin_1.onReady) {
                        origin_1.onReady(result);
                    }
                    completer.resolve({ result: result });
                    dequeue(promise);
                },
                onStop: function (err) {
                    if (origin_1.onStop) {
                        origin_1.onStop(err);
                    }
                    completer.resolve({ err: err });
                    dequeue(promise);
                }
            };
            queue(promise);
            return object;
        }
        var newCallback = function (err, result) {
            callbacks(err, result);
            completer.resolve({ err: err, result: result });
            dequeue(promise);
        };
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
