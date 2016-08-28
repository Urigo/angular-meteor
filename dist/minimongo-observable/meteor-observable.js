'use strict';
var rxjs_1 = require('rxjs');
var utils_1 = require('../utils');
function throwInvalidCallback(method) {
    throw new Error("Invalid " + method + " arguments:\n     your last param can't be a callback function, \n     please remove it and use \".subscribe\" of the Observable!");
}
var MeteorObservable = (function () {
    function MeteorObservable() {
    }
    MeteorObservable.call = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var lastParam = args[args.length - 1];
        if (utils_1.isMeteorCallbacks(lastParam)) {
            throwInvalidCallback('MeteorObservable.call');
        }
        return rxjs_1.Observable.create(function (observer) {
            Meteor.call.apply(Meteor, [name].concat(args.concat([
                function (error, result) {
                    error ? observer.error(error) :
                        observer.next(result);
                    observer.complete();
                }
            ])));
        });
    };
    MeteorObservable.subscribe = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var lastParam = args[args.length - 1];
        if (utils_1.isMeteorCallbacks(lastParam)) {
            throwInvalidCallback('MeteorObservable.subscribe');
        }
        return rxjs_1.Observable.create(function (observer) {
            var handler = Meteor.subscribe.apply(Meteor, [name].concat(args.concat([{
                    onError: function (error) {
                        observer.error(error);
                        observer.complete();
                    },
                    onReady: function () {
                        observer.next();
                        observer.complete();
                    }
                }
            ])));
            return function () { return handler.stop(); };
        });
    };
    return MeteorObservable;
}());
exports.MeteorObservable = MeteorObservable;
