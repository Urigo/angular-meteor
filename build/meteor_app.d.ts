import { ApplicationRef, NgZone, Type, Provider } from 'angular2/core';
import { ComponentRef, Injector } from 'angular2/core';
import * as Promise from 'meteor-promise';
export declare type Providers = Array<Type | Provider | any[]>;
export declare class MeteorApp {
    private static ENV;
    private appInjector;
    constructor(appInjector: Injector);
    static launch(appInjector: Injector, bootstrap: Promise<ComponentRef>): Promise<ComponentRef>;
    static bootstrap(component: Type, platProviders: Providers, appProviders: Providers, providers: Providers): Promise<ComponentRef>;
    ngZone: NgZone;
    appRef: ApplicationRef;
    static current(): any;
    static ngZone(): NgZone;
}
