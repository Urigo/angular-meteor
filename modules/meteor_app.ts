'use strict';

import {
  NgZone,
  Provider,
  Injectable,
  NgModule
} from '@angular/core';

import {check} from './utils';
import {scheduleMicroTask} from './zone_utils';
import {DataObserver} from './data_observer'

// Contains utility methods useful for the integration. 
@Injectable()
export class MeteorApp {
  private _appCycles: AppCycles;

  constructor(private _ngZone: NgZone) {
    this._appCycles = new AppCycles(_ngZone);
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
    return this._ngZone;
  }
}

// To be used to detect an Angular 2 app's change detection cycles.
export class AppCycles {
  private _isZoneStable: boolean = true;
  private _onStableCb: Function[] = [];
  private _onUnstable;
  private _onStable;

  constructor(private _ngZone: NgZone) {
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
          this._isZoneStable = true;
          this._runIfStable();
        }
      });
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
