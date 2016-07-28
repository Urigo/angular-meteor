"use strict";
var Rx_1 = require("rxjs/Rx");
var _ = require("lodash");
var MeteorObservable = (function () {
    function MeteorObservable() {
    }
    MeteorObservable.call = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var argumentsArray = Array.prototype.slice.call(arguments);
        var lastParam = argumentsArray[argumentsArray.length - 1];
        if (lastParam && _.isFunction(lastParam))
            throw new Error("Invalid MeteorObservable.call arguments: your last param can't be a callback function, please remove it and use `.subscribe` of the Observable!");
        return Rx_1.Observable.create(function (observer) {
            Meteor.call.apply(Meteor, argumentsArray.concat([
                function (error, result) {
                    if (error) {
                        observer.error(error);
                        observer.complete();
                    }
                    else {
                        observer.next(result);
                        observer.complete();
                    }
                }
            ]));
        });
    };
    MeteorObservable.subscribe = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var argumentsArray = Array.prototype.slice.call(arguments);
        var lastParam = argumentsArray[argumentsArray.length - 1];
        if (lastParam && _.isObject(lastParam) && (lastParam.onReady || lastParam.onError))
            throw new Error("Invalid MeteorObservable.subscribe arguments: your last param can't be a callbacks object, please remove it and use `.subscribe` of the Observable!");
        return Rx_1.Observable.create(function (observer) {
            var handle = Meteor.subscribe.apply(Meteor, argumentsArray.concat([
                {
                    onReady: function () {
                        observer.next();
                        observer.complete();
                    },
                    onError: function (error) {
                        observer.error(error);
                        observer.complete();
                    }
                }
            ]));
            return function () {
                if (handle && handle.stop) {
                    handle.stop();
                }
            };
        });
    };
    return MeteorObservable;
}());
exports.MeteorObservable = MeteorObservable;
