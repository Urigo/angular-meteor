'use strict';

import {ApplicationRef, NgZone, Type, Provider} from '@angular/core';
import {ComponentRef, createPlatform, ReflectiveInjector,
  coreLoadAndBootstrap} from '@angular/core';
import {isPresent} from '@angular/core/src/facade/lang';
import {Meteor} from 'meteor/meteor';
import * as Promise from 'meteor-promise';

export type Providers = Array<Type | Provider | any[]>;

export class MeteorApp {
  private static ENV: Meteor.EnvironmentVariable = new Meteor.EnvironmentVariable();

  static launch(appRef: ApplicationRef,
                bootstrap: Promise<ComponentRef>): Promise<ComponentRef> {
    const newApp = new MeteorApp(appRef);

    return new Promise<ComponentRef>(function(resolve, reject) {
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
                   providers: Providers): Promise<ComponentRef> {

    const platRef = createPlatform(ReflectiveInjector.resolveAndCreate(platProviders));
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
    return app && app.ngZone;
  }

  constructor(public appRef: ApplicationRef) {}

  get ngZone(): NgZone {
    return this.appRef.injector.get(NgZone);
  }
}
