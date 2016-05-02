'use strict';
var core_1 = require('angular2/core');
var core_2 = require('angular2/core');
var lang_1 = require('angular2/src/facade/lang');
var meteor_1 = require('meteor/meteor');
var Promise = require('meteor-promise');
var MeteorApp = (function () {
    function MeteorApp(appInjector) {
        this.appInjector = appInjector;
    }
    MeteorApp.launch = function (appInjector, bootstrap) {
        var newApp = new MeteorApp(appInjector);
        return new Promise(function (resolve, reject) {
            meteor_1.Meteor.startup(function () {
                MeteorApp.ENV.withValue(newApp, function () {
                    bootstrap().then(resolve, reject);
                });
            });
        });
    };
    MeteorApp.bootstrap = function (component, platProviders, appProviders, providers) {
        var platRef = core_2.createPlatform(core_2.ReflectiveInjector.resolveAndCreate(platProviders));
        appProviders = lang_1.isPresent(providers) ? [appProviders, providers] : appProviders;
        var appInjector = core_2.ReflectiveInjector.resolveAndCreate(appProviders, platRef.injector);
        return this.launch(appInjector, function () { return core_2.coreLoadAndBootstrap(appInjector, component); });
    };
    Object.defineProperty(MeteorApp.prototype, "ngZone", {
        get: function () {
            return this.appInjector.get(core_1.NgZone);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MeteorApp.prototype, "appRef", {
        get: function () {
            return this.appInjector.get(core_1.ApplicationRef);
        },
        enumerable: true,
        configurable: true
    });
    MeteorApp.current = function () {
        return this.ENV.get();
    };
    MeteorApp.ngZone = function () {
        var app = MeteorApp.current();
        return app && app.ngZone;
    };
    MeteorApp.ENV = new meteor_1.Meteor.EnvironmentVariable();
    return MeteorApp;
}());
exports.MeteorApp = MeteorApp;
