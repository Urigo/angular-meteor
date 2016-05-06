import { ApplicationRef, NgZone, Type, Provider } from '@angular/core';
import { ComponentRef } from '@angular/core';
import * as Promise from 'meteor-promise';
export declare type Providers = Array<Type | Provider | any[]>;
export declare class MeteorApp {
    appRef: ApplicationRef;
    private static ENV;
    static launch(appRef: ApplicationRef, bootstrap: Promise<ComponentRef>): Promise<ComponentRef>;
    static bootstrap(component: Type, platProviders: Providers, appProviders: Providers, providers: Providers): Promise<ComponentRef>;
    static current(): any;
    static ngZone(): NgZone;
    constructor(appRef: ApplicationRef);
    ngZone: NgZone;
}
