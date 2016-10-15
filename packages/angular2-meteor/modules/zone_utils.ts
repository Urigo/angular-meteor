'use strict';

import * as _ from 'underscore';

/**
 * Contains a set of methods to schedule Zone runs.
 * Supposed to be used mostly in @MeteorReactive to patch
 * Meteor methods' callbacks.
 * After patching, callbacks will be run in the global zone
 * (i.e. outside of Angular 2), at the same time,
 * a Angular 2 zone run will be scheduled in order to
 * initiate UI update. In order to reduce number of
 * UI updates caused by the callbacks near the same time,
 * zone runs are debounced.
 */

import {MeteorCallbacks, gZone, check, noop} from './utils';

export class ZoneRunScheduler {
  private _zoneTasks = new Map<Zone, Task>();
  private _onRunCbs = new Map<Zone, Function[]>();

  zoneRun(zone: Zone): Function {
    return () => {
      zone.run(noop);
      this._runAfterRunCbs(zone);
      this._zoneTasks.delete(zone);
    };
  }

  runZones() {
    this._zoneTasks.forEach((task, zone) => {
      task.invoke();
    });
  }

  _runAfterRunCbs(zone: Zone) {
    if (this._onRunCbs.has(zone)) {
      let cbs = this._onRunCbs.get(zone);
      while (cbs.length !== 0) {
        (cbs.pop())();
      }
      this._onRunCbs.delete(zone);
    }
  }

  scheduleRun(zone: Zone) {
    if (zone === gZone) {
      return;
    }

    let runTask = this._zoneTasks.get(zone);

    if (runTask) {
      runTask.cancelFn(runTask);
      this._zoneTasks.delete(zone);
    }

    runTask = gZone.scheduleMacroTask('runZones',
      this.zoneRun(zone), { isPeriodic: true },
      task => {
        task._tHandler = setTimeout(task.invoke);
      },
      task => {
        clearTimeout(task._tHandler);
      });
    this._zoneTasks.set(zone, runTask);
  }

  onAfterRun(zone: Zone, cb: Function) {
    check(cb, Function);

    if (!this._zoneTasks.has(zone)) {
      cb();
      return;
    }

    let cbs = this._onRunCbs.get(zone);
    if (!cbs) {
      cbs = [];
      this._onRunCbs.set(zone, cbs);
    }
    cbs.push(cb);
  }
}

export const zoneRunScheduler = new ZoneRunScheduler();

function wrapFuncInZone(zone: Zone, method: Function, context: any) {
  return function(...args) {
    gZone.run(() => {
      method.apply(context, args);
    });
    zoneRunScheduler.scheduleRun(zone);
  };
}

export function wrapCallbackInZone(
    zone: Zone, callback: MeteorCallbacks, context: any): MeteorCallbacks {

  if (_.isFunction(callback)) {
    return wrapFuncInZone(zone, <Function>callback, context);
  }

  for (let fn of _.functions(callback)) {
    callback[fn] = wrapFuncInZone(zone, callback[fn], context);
  }

  return callback;
}

export function scheduleMicroTask(fn: Function) {
  Zone.current.scheduleMicroTask('scheduleMicrotask', fn);
}
