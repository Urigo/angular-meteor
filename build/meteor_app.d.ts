import { ApplicationRef, NgZone, Type, Provider } from '@angular/core';
import { ComponentRef } from '@angular/core';
export declare type Providers = Array<Type | Provider | any[]>;
/**
 * To be used to access current Angular2 zone and
 * ApplicationRef instances in any place of Meteor environment,
 * i.e., where deps injection is not available.
 */
export declare class MeteorApp {
    appRef: ApplicationRef;
    private static ENV;
    static launch(appRef: ApplicationRef, bootstrap: () => Promise<ComponentRef<any>>): Promise<ComponentRef<any>>;
    static bootstrap(component: Type, platProviders: Providers, appProviders: Providers, providers: Providers): Promise<ComponentRef<any>>;
    static current(): any;
    static ngZone(): NgZone;
    constructor(appRef: ApplicationRef);
    ngZone: NgZone;
}
