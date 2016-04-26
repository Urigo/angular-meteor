'use strict';
var core_1 = require('angular2/core');
var Promise = require('meteor-promise');
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
        var platRef = core_1.platform(platProviders);
        var appRef = platRef.application(appProviders);
        return this.launch(appRef, function () { return appRef.bootstrap(component, providers); });
    };
    Object.defineProperty(MeteorApp.prototype, "ngZone", {
        get: function () {
            return this.appRef.injector.get(core_1.NgZone);
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
    MeteorApp.ENV = new Meteor.EnvironmentVariable();
    return MeteorApp;
}());
exports.MeteorApp = MeteorApp;
