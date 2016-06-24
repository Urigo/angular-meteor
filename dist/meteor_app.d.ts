import { ApplicationRef, NgZone, Type, Provider } from '@angular/core';
import { ComponentRef } from '@angular/core';
export declare type Providers = Array<Type | Provider | any[]>;
export declare class MeteorAppRegistry {
    private _apps;
    register(token: Element, app: MeteorApp): void;
    unregister(token: Element): void;
    get(token: Element): MeteorApp;
}
export declare let appRegistry: MeteorAppRegistry;
export declare class MeteorApp {
    appRef: ApplicationRef;
    private _appCycles;
    static bootstrap(component: Type, platProviders: Providers, appProviders: Providers, providers?: Providers): Promise<ComponentRef<any>>;
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
