'use strict';
var core_1 = require('angular2/core');
var mongo_cursor_differ_1 = require('./mongo_cursor_differ');
var change_detection_1 = require('angular2/src/core/change_detection/change_detection');
var lang_1 = require('angular2/src/facade/lang');
function meteorProviders() {
    var providers = [];
    var factories = change_detection_1.defaultIterableDiffers.factories;
    if (factories) {
        factories.push(new mongo_cursor_differ_1.MongoCursorDifferFactory());
    }
    providers.push(core_1.provide(core_1.IterableDiffers, {
        useValue: new core_1.IterableDiffers(factories)
    }));
    return providers;
}
exports.METEOR_PROVIDERS = lang_1.CONST_EXPR(meteorProviders());
