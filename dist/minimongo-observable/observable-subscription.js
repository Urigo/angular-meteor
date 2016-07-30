"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var rxjs_1 = require('rxjs');
var ObservableMeteorSubscription = (function (_super) {
    __extends(ObservableMeteorSubscription, _super);
    function ObservableMeteorSubscription(subscribe) {
        _super.call(this, subscribe);
    }
    ObservableMeteorSubscription.create = function (subscribe) {
        return new ObservableMeteorSubscription(subscribe);
    };
    ObservableMeteorSubscription.prototype.stop = function () {
        if (this._meteorSubscriptionRef && this._meteorSubscriptionRef.stop) {
            this._meteorSubscriptionRef.stop();
        }
    };
    return ObservableMeteorSubscription;
}(rxjs_1.Observable));
exports.ObservableMeteorSubscription = ObservableMeteorSubscription;
