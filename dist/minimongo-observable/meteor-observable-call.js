"use strict";
var Rx_1 = require("rxjs/Rx");
function isFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
}
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
        if (lastParam && isFunction(lastParam))
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
            return function () { };
        });
    };
    return MeteorObservable;
}());
exports.MeteorObservable = MeteorObservable;
