import { ApplicationRef, NgZone, Type, Provider, ComponentRef } from 'angular2/core';
import * as Promise from 'meteor-promise';
export declare type Providers = Array<Type | Provider | any[]>;
export declare class MeteorApp {
    private static ENV;
    private appRef;
    constructor(appRef: ApplicationRef);
    static launch(appRef: ApplicationRef, bootstrap: Promise<ComponentRef>): Promise<ComponentRef>;
    static bootstrap(component: Type, platProviders: Providers, appProviders: Providers, providers: Providers): Promise<ComponentRef>;
    ngZone: NgZone;
    static current(): any;
    static ngZone(): NgZone;
}
