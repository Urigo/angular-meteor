'use strict';
var core_1 = require('@angular/core');
var core_2 = require('@angular/core');
var lang_1 = require('@angular/core/src/facade/lang');
var utils_1 = require('./utils');
/**
 * To be used to access current Angular2 zone and
 * ApplicationRef instances in any place of Meteor environment,
 * i.e., where deps injection is not available.
 */
var MeteorApp = (function () {
    function MeteorApp(appRef) {
        this.appRef = appRef;
    }
    MeteorApp.launch = function (appRef, bootstrap) {
        var newApp = new MeteorApp(appRef);
        return new Promise(function (resolve, reject) {
            Meteor.startup(function () {
                MeteorApp.ENV.withValue(newApp, function () {
                    bootstrap().then(resolve, reject);
                });
            });
        });
    };
    MeteorApp.bootstrap = function (component, platProviders, appProviders, providers) {
        var platRef = core_1.getPlatform();
        if (lang_1.isBlank(platRef)) {
            platRef = core_2.createPlatform(core_2.ReflectiveInjector.resolveAndCreate(platProviders));
        }
        appProviders = lang_1.isPresent(providers) ? [appProviders, providers] : appProviders;
        var appInjector = core_2.ReflectiveInjector.resolveAndCreate(appProviders, platRef.injector);
        var appRef = appInjector.get(core_1.ApplicationRef);
        return this.launch(appRef, function () { return core_2.coreLoadAndBootstrap(appInjector, component); });
    };
    MeteorApp.current = function () {
        return this.ENV.get();
    };
    MeteorApp.ngZone = function () {
        var app = MeteorApp.current();
        return app ? app.ngZone : utils_1.g.Zone.current;
    };
    Object.defineProperty(MeteorApp.prototype, "ngZone", {
        get: function () {
            return this.appRef.injector.get(core_1.NgZone);
        },
        enumerable: true,
        configurable: true
    });
    MeteorApp.ENV = new Meteor.EnvironmentVariable();
    return MeteorApp;
}());
exports.MeteorApp = MeteorApp;
