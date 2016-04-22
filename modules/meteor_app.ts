'use strict';

import {ApplicationRef, NgZone, Type, Provider, ComponentRef, platform} from 'angular2/core';
import * as Promise from 'meteor-promise';

export type Providers = Array<Type | Provider | any[]>;

export class MeteorApp {
  private static ENV: Meteor.EnvironmentVariable = new Meteor.EnvironmentVariable();

  private appRef: ApplicationRef;

  constructor(appRef: ApplicationRef) {
    this.appRef = appRef;
  }

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

    const platRef = platform(platProviders);
    const appRef = platRef.application(appProviders);

    return this.launch(appRef, () => appRef.bootstrap(component, providers));
  }

  static get current() {
    return this.ENV.get();
  }

  static get ngZone(): NgZone {
    const app = MeteorApp.current;
    return app && app.appRef.injector.get(NgZone);
  }
}
