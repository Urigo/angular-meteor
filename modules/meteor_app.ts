'use strict';

import {
  ApplicationRef,
  NgZone,
  Type,
  Provider,
  provide,
  getPlatform,
  Injectable
} from '@angular/core';
import {
  ComponentRef,
  createPlatform,
  ReflectiveInjector,
  coreLoadAndBootstrap
} from '@angular/core';
import {isPresent, isBlank, scheduleMicroTask} from '@angular/core/src/facade/lang';

import {check} from './utils';

import {DataObserver} from './data_observer';

export type Providers = Array<Type | Provider | any[]>;

// Makes it possible to take an app instance by DOM element of the main component.
export class MeteorAppRegistry {
  private _apps = new Map<any, MeteorApp>();

  register(token: Element, app: MeteorApp): void {
    this._apps.set(token, app);
  }

  unregister(token: Element): void {
    this._apps.delete(token);
  }

  get(token: Element): MeteorApp {
    return this._apps.get(token);
  }
}

export let appRegistry = new MeteorAppRegistry();

// Contains utility methods useful for the integration. 
@Injectable()
export class MeteorApp {
  private _appCycles: AppCycles;

  static bootstrap(component: Type,
                   platProviders: Providers,
                   appProviders: Providers,
                   providers?: Providers): Promise<ComponentRef<any>> {
    let platRef = getPlatform();
    if (isBlank(platRef)) {
      platRef = createPlatform(ReflectiveInjector.resolveAndCreate(platProviders));
    }
    appProviders = isPresent(providers) ? [...appProviders, ...providers] : appProviders;
    appProviders.push(provide(MeteorApp, {
      deps: [ApplicationRef],
      useFactory: appRef => {
        const elem = appRef._rootCompRef.location.nativeElement;
        return appRegistry.get(elem);
      },
    }));
    const appInjector = ReflectiveInjector.resolveAndCreate(
      appProviders, platRef.injector);
    const appRef = appInjector.get(ApplicationRef);
    const newApp = new MeteorApp(appRef);

    return new Promise<ComponentRef<any>>(function(resolve, reject) {
      Meteor.startup(() => {
        return coreLoadAndBootstrap(component, appInjector)
          .then(compRef => {
            // It's ok since one app can bootstrap
            // one component currently.
            appRef._rootCompRef = compRef;
            const elem = compRef.location.nativeElement;
            appRegistry.register(elem, newApp);
            appRef.registerDisposeListener(() => {
              appRegistry.unregister(elem);
              delete appRef._rootCompRef;
            });
            return compRef;
          })
          .then(resolve, reject);
      });
    });
  }

  constructor(public appRef: ApplicationRef) {
    this._appCycles = new AppCycles(appRef);
  }

  onRendered(cb: Function): void {
    check(cb, Function);

    this._appCycles.onStable(() => {
      DataObserver.onReady(() => {
        // No way to get ngZone's inner zone,
        // so make one more run to insure
        // data rendered.
        this.ngZone.run(() => cb());
      });
    });
  }

  onStable(cb: Function): void {
    this._appCycles.onStable(cb);
  }

  get ngZone(): NgZone {
    return this.appRef.zone;
  }
}

// To be used to detect an Angular 2 app's change detection cycles.
export class AppCycles {
  private _ngZone: NgZone;
  private _isZoneStable: boolean = true;
  private _onStableCb: Function[] = [];
  private _onUnstable;
  private _onStable;

  constructor(private _appRef: ApplicationRef) {
    this._ngZone = this._appRef.zone;
    this._watchAngularEvents();
  }

  isStable(): boolean {
    return this._isZoneStable && !this._ngZone.hasPendingMacrotasks;
  }

  onStable(cb: Function): void {
    check(cb, Function);

    this._onStableCb.push(cb);
    this._runIfStable();
  }

  dispose() {
    if (this._onUnstable) {
      this._onUnstable.dispose();
    }

    if (this._onStable) {
      this._onStable.dispose();
    }
  }

  _watchAngularEvents(): void {
    this._onUnstable = this._ngZone.onUnstable.subscribe({ next: () => {
        this._isZoneStable = false;
      }
    });

    this._ngZone.runOutsideAngular(() => {
      this._onStable = this._ngZone.onStable.subscribe({ next: () => {
          scheduleMicroTask(() => {
            this._isZoneStable = true;
            this._runIfStable();
          });
        }
      })
    });
  }

  _runIfStable() {
    if (this.isStable()) {
      scheduleMicroTask(() => {
        while (this._onStableCb.length !== 0) {
          (this._onStableCb.pop())();
        }
      });
    }
  }
}
