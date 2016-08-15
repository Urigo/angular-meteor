'use strict';

import {
  ApplicationRef,
  NgZone,
  Type,
  Provider,
  provide,
  Injectable,
  NgModule
} from '@angular/core';
import {
  isPresent,
  isBlank,
  scheduleMicroTask
} from '@angular/core/src/facade/lang';

import {check} from './utils';

import {DataObserver} from './data_observer';

import {METEOR_PROVIDERS} from './providers';

const appRegistry = new Map<ApplicationRef, MeteorApp>();

@NgModule({
  providers: [
    ...METEOR_PROVIDERS,
    provide(MeteorApp, {
      deps: [ApplicationRef],
      useFactory: appRef => {
        return appRegistry.get(appRef);
      }
    })
  ]
})
export class MeteorModule {
  constructor(appRef: ApplicationRef) {
    appRegistry.set(appRef, new MeteorApp(appRef));
  }
}

// Contains utility methods useful for the integration. 
@Injectable()
export class MeteorApp {
  private _appCycles: AppCycles;

  constructor(public appRef: ApplicationRef) {
    this._appCycles = new AppCycles(appRef);
  }

  onRendered(cb: Function): void {
    check(cb, Function);

    this._appCycles.onStable(() => {
      DataObserver.onReady(() => {
        this._appCycles.onStable(cb);
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
