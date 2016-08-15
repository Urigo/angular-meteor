import { ApplicationRef, NgZone } from '@angular/core';
export declare class MeteorModule {
    constructor(appRef: ApplicationRef);
}
export declare class MeteorApp {
    appRef: ApplicationRef;
    private _appCycles;
    constructor(appRef: ApplicationRef);
    onRendered(cb: Function): void;
    onStable(cb: Function): void;
    ngZone: NgZone;
}
export declare class AppCycles {
    private _appRef;
    private _ngZone;
    private _isZoneStable;
    private _onStableCb;
    private _onUnstable;
    private _onStable;
    constructor(_appRef: ApplicationRef);
    isStable(): boolean;
    onStable(cb: Function): void;
    dispose(): void;
    _watchAngularEvents(): void;
    _runIfStable(): void;
}
