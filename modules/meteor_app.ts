'use strict';

import {ApplicationRef, NgZone, Type, Provider, getPlatform} from '@angular/core';
import {ComponentRef, createPlatform, ReflectiveInjector,
  coreLoadAndBootstrap} from '@angular/core';
import {isPresent, isBlank} from '@angular/core/src/facade/lang';
import {Meteor} from 'meteor/meteor';
import {g} from './utils';

export type Providers = Array<Type | Provider | any[]>;

/**
 * To be used to access current Angular2 zone and 
 * ApplicationRef instances in any place of Meteor environment,
 * i.e., where deps injection is not available.
 */
export class MeteorApp {
  private static ENV: Meteor.EnvironmentVariable = new Meteor.EnvironmentVariable();

  static launch(appRef: ApplicationRef,
                bootstrap: () => Promise<ComponentRef<any>>): Promise<ComponentRef<any>> {
                const newApp = new MeteorApp(appRef);
    return new Promise<ComponentRef<any>>(function(resolve, reject) {
      Meteor.startup(() => {
        MeteorApp.ENV.withValue(newApp, () => {
          bootstrap().then(resolve, reject);
        });
      });
    });
  }

  static bootstrap(component: Type,
                   platProviders: Providers,
                   appProviders: Providers,
                   providers: Providers): Promise<ComponentRef<any>> {
    let platRef = getPlatform();
    if (isBlank(platRef)) {
      platRef = createPlatform(ReflectiveInjector.resolveAndCreate(platProviders));
    }
    appProviders = isPresent(providers) ? [appProviders, providers] : appProviders;
    const appInjector = ReflectiveInjector.resolveAndCreate(
      appProviders, platRef.injector);
    const appRef = appInjector.get(ApplicationRef);

    return this.launch(appRef, () => coreLoadAndBootstrap(appInjector, component));
  }

  static current() {
    return this.ENV.get();
  }

  static ngZone(): NgZone {
    const app = MeteorApp.current();
    return app ? app.ngZone : g.Zone.current;
  }

  constructor(public appRef: ApplicationRef) {}

  get ngZone(): NgZone {
    return this.appRef.injector.get(NgZone);
  }
}
