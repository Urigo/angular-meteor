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
var core_2 = require('@angular/core');
var lang_1 = require('@angular/core/src/facade/lang');
var async_1 = require('@angular/core/src/facade/async');
var data_observer_1 = require('./data_observer');
// Makes it possible to take an app instance by DOM element of the main component.
var MeteorAppRegistry = (function () {
    function MeteorAppRegistry() {
        this._apps = new Map();
    }
    MeteorAppRegistry.prototype.register = function (token, app) {
        this._apps.set(token, app);
    };
    MeteorAppRegistry.prototype.unregister = function (token) {
        this._apps.delete(token);
    };
    MeteorAppRegistry.prototype.get = function (token) {
        return this._apps.get(token);
    };
    return MeteorAppRegistry;
}());
exports.MeteorAppRegistry = MeteorAppRegistry;
exports.appRegistry = new MeteorAppRegistry();
// Contains utility methods useful for the integration. 
var MeteorApp = (function () {
    function MeteorApp(appRef) {
        this.appRef = appRef;
        this._appCycles = new AppCycles(appRef);
    }
    MeteorApp.bootstrap = function (component, platProviders, appProviders, providers) {
        var platRef = core_1.getPlatform();
        if (lang_1.isBlank(platRef)) {
            platRef = core_2.createPlatform(core_2.ReflectiveInjector.resolveAndCreate(platProviders));
        }
        appProviders = lang_1.isPresent(providers) ? appProviders.concat(providers) : appProviders;
        appProviders.push(core_1.provide(MeteorApp, {
            deps: [core_1.ApplicationRef],
            useFactory: function (appRef) {
                var elem = appRef._rootCompRef.location.nativeElement;
                return exports.appRegistry.get(elem);
            },
        }));
        var appInjector = core_2.ReflectiveInjector.resolveAndCreate(appProviders, platRef.injector);
        var appRef = appInjector.get(core_1.ApplicationRef);
        var newApp = new MeteorApp(appRef);
        return new Promise(function (resolve, reject) {
            Meteor.startup(function () {
                return core_2.coreLoadAndBootstrap(component, appInjector)
                    .then(function (compRef) {
                    // It's ok since one app can bootstrap
                    // one component currently.
                    appRef._rootCompRef = compRef;
                    var elem = compRef.location.nativeElement;
                    exports.appRegistry.register(elem, newApp);
                    appRef.registerDisposeListener(function () {
                        exports.appRegistry.unregister(elem);
                        delete appRef._rootCompRef;
                    });
                    return compRef;
                })
                    .then(resolve, reject);
            });
        });
    };
    MeteorApp.prototype.onRendered = function (cb) {
        var _this = this;
        check(cb, Function);
        this._appCycles.onStable(function () {
            data_observer_1.DataObserver.onReady(function () {
                // No way to get ngZone's inner zone,
                // so make one more run to insure
                // data rendered.
                _this.ngZone.run(function () { return cb(); });
            });
        });
    };
    MeteorApp.prototype.onStable = function (cb) {
        this._appCycles.onStable(cb);
    };
    Object.defineProperty(MeteorApp.prototype, "ngZone", {
        get: function () {
            return this.appRef.zone;
        },
        enumerable: true,
        configurable: true
    });
    MeteorApp = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [core_1.ApplicationRef])
    ], MeteorApp);
    return MeteorApp;
}());
exports.MeteorApp = MeteorApp;
// To be used to detect an Angular 2 app's change detection cycles.
var AppCycles = (function () {
    function AppCycles(_appRef) {
        this._appRef = _appRef;
        this._isZoneStable = true;
        this._onStableCb = [];
        this._ngZone = this._appRef.zone;
        this._watchAngularEvents();
    }
    AppCycles.prototype.isStable = function () {
        return this._isZoneStable && !this._ngZone.hasPendingMacrotasks;
    };
    AppCycles.prototype.onStable = function (cb) {
        check(cb, Function);
        this._onStableCb.push(cb);
        this._runIfStable();
    };
    AppCycles.prototype.dispose = function () {
        if (this._onUnstable) {
            async_1.ObservableWrapper.dispose(this._onUnstable);
        }
        if (this._onStable) {
            async_1.ObservableWrapper.dispose(this._onStable);
        }
    };
    AppCycles.prototype._watchAngularEvents = function () {
        var _this = this;
        this._onUnstable = async_1.ObservableWrapper.subscribe(this._ngZone.onUnstable, function () {
            _this._isZoneStable = false;
        });
        this._ngZone.runOutsideAngular(function () {
            _this._onStable = async_1.ObservableWrapper.subscribe(_this._ngZone.onStable, function () {
                lang_1.scheduleMicroTask(function () {
                    _this._isZoneStable = true;
                    _this._runIfStable();
                });
            });
        });
    };
    AppCycles.prototype._runIfStable = function () {
        var _this = this;
        if (this.isStable()) {
            lang_1.scheduleMicroTask(function () {
                while (_this._onStableCb.length !== 0) {
                    (_this._onStableCb.pop())();
                }
            });
        }
    };
    return AppCycles;
}());
exports.AppCycles = AppCycles;
