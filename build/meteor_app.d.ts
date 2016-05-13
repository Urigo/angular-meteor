import { ApplicationRef, NgZone, Type, Provider } from '@angular/core';
import { ComponentRef } from '@angular/core';
export declare type Providers = Array<Type | Provider | any[]>;
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
