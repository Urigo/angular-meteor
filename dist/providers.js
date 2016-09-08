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
var meteor_app_1 = require('./meteor_app');
var mongo_cursor_differ_1 = require('./mongo_cursor_differ');
function meteorProviders() {
    return [
        core_1.IterableDiffers.extend([new mongo_cursor_differ_1.MongoCursorDifferFactory()]),
        {
            provide: meteor_app_1.MeteorApp,
            deps: [core_1.NgZone],
            useValue: function (ngZone) {
                return new meteor_app_1.MeteorApp(ngZone);
            }
        }
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
