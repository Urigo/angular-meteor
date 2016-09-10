'use strict';
var core_1 = require('@angular/core');
var mongo_cursor_differ_1 = require('./mongo_cursor_differ');
function meteorProviders() {
    return [
        core_1.IterableDiffers.extend([new mongo_cursor_differ_1.MongoCursorDifferFactory()])
    ];
}
exports.METEOR_PROVIDERS = meteorProviders();
var MeteorModule = (function () {
    function MeteorModule() {
    }
    MeteorModule = __decorate([
        core_1.NgModule({
            providers: exports.METEOR_PROVIDERS
        }), 
        __metadata('design:paramtypes', [])
    ], MeteorModule);
    return MeteorModule;
}());
exports.MeteorModule = MeteorModule;
