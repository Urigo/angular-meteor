import { NgZone } from '@angular/core';
export declare class MeteorApp {
    private _ngZone;
    private _appCycles;
    constructor(_ngZone: NgZone);
    onRendered(cb: Function): void;
    onStable(cb: Function): void;
    ngZone: NgZone;
}
export declare class AppCycles {
    private _ngZone;
    private _isZoneStable;
    private _onStableCb;
    private _onUnstable;
    private _onStable;
    constructor(_ngZone: NgZone);
    isStable(): boolean;
    onStable(cb: Function): void;
    dispose(): void;
    _watchAngularEvents(): void;
    _runIfStable(): void;
}
