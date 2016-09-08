'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var utils_1 = require('./utils');
var zone_utils_1 = require('./zone_utils');
var data_observer_1 = require('./data_observer');
// Contains utility methods useful for the integration. 
var MeteorApp = (function () {
    function MeteorApp(_ngZone) {
        this._ngZone = _ngZone;
        this._appCycles = new AppCycles(_ngZone);
    }
    MeteorApp.prototype.onRendered = function (cb) {
        var _this = this;
        utils_1.check(cb, Function);
        this._appCycles.onStable(function () {
            data_observer_1.DataObserver.onReady(function () {
                _this._appCycles.onStable(cb);
            });
        });
    };
    MeteorApp.prototype.onStable = function (cb) {
        this._appCycles.onStable(cb);
    };
    Object.defineProperty(MeteorApp.prototype, "ngZone", {
        get: function () {
            return this._ngZone;
        },
        enumerable: true,
        configurable: true
    });
    MeteorApp = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [core_1.NgZone])
    ], MeteorApp);
    return MeteorApp;
}());
exports.MeteorApp = MeteorApp;
// To be used to detect an Angular 2 app's change detection cycles.
var AppCycles = (function () {
    function AppCycles(_ngZone) {
        this._ngZone = _ngZone;
        this._isZoneStable = true;
        this._onStableCb = [];
        this._watchAngularEvents();
    }
    AppCycles.prototype.isStable = function () {
        return this._isZoneStable && !this._ngZone.hasPendingMacrotasks;
    };
    AppCycles.prototype.onStable = function (cb) {
        utils_1.check(cb, Function);
        this._onStableCb.push(cb);
        this._runIfStable();
    };
    AppCycles.prototype.dispose = function () {
        if (this._onUnstable) {
            this._onUnstable.dispose();
        }
        if (this._onStable) {
            this._onStable.dispose();
        }
    };
    AppCycles.prototype._watchAngularEvents = function () {
        var _this = this;
        this._onUnstable = this._ngZone.onUnstable.subscribe({ next: function () {
                _this._isZoneStable = false;
            }
        });
        this._ngZone.runOutsideAngular(function () {
            _this._onStable = _this._ngZone.onStable.subscribe({ next: function () {
                    _this._isZoneStable = true;
                    _this._runIfStable();
                }
            });
        });
    };
    AppCycles.prototype._runIfStable = function () {
        var _this = this;
        if (this.isStable()) {
            zone_utils_1.scheduleMicroTask(function () {
                while (_this._onStableCb.length !== 0) {
                    (_this._onStableCb.pop())();
                }
            });
        }
    };
    return AppCycles;
}());
exports.AppCycles = AppCycles;
