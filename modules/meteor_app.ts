'use strict';

import {ApplicationRef, NgZone, Type, Provider} from 'angular2/core';
import {ComponentRef, createPlatform, ReflectiveInjector,
  Injector, coreLoadAndBootstrap} from 'angular2/core';
import {isPresent} from 'angular2/src/facade/lang';
import * as Promise from 'meteor-promise';

export type Providers = Array<Type | Provider | any[]>;

export class MeteorApp {
  private static ENV: Meteor.EnvironmentVariable = new Meteor.EnvironmentVariable();

  private appInjector: Injector;

  constructor(appInjector: Injector) {
    this.appInjector = appInjector;
  }

  static launch(appInjector: Injector,
                bootstrap: Promise<ComponentRef>): Promise<ComponentRef> {
    const newApp = new MeteorApp(appInjector);

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
    var appInjector = ReflectiveInjector.resolveAndCreate(
      appProviders, platRef.injector);

    return this.launch(appInjector, () => coreLoadAndBootstrap(appInjector, component));
  }

  get ngZone(): NgZone {
    return this.appInjector.get(NgZone);
  }

  get appRef(): ApplicationRef {
    return this.appInjector.get(ApplicationRef);
  }

  static current() {
    return this.ENV.get();
  }

  static ngZone(): NgZone {
    const app = MeteorApp.current();
    return app && app.ngZone;
  }
}
