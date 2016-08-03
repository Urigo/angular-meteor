'use strict';

/**
 * Contains a set of methods used to patch original Meteor methods.
 * After patching, callback parameters are run in the global zone
 * (i.e. outside of Angular2). Also, each callback schedules
 * Angular2 zones run (one per each app) in order to initiate
 * change detection cycles.
 * Scheduling happens in a way to reduce number of zone runs
 * since multiple callbacks can be run near the same time.
 */

import {noop, isPresent} from '@angular/core/src/facade/lang';

import {isMeteorCallbacks, g, gZone, check} from './utils';

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

function wrapInZone(method: Function, context: any) {
  let zone = g.Zone.current;
  return function(...args) {
    gZone.run(() => {
      method.apply(context, args);
    });
    zoneRunScheduler.scheduleRun(zone);
  };
}

function wrapCallback(callback: Function | Object, context: any): any {
  if (_.isFunction(callback)) {
    return wrapInZone(<Function>callback, context);
  }

  for (let fn of _.functions(callback)) {
    callback[fn] = wrapInZone(callback[fn], context);
  }

  return callback;
}

// Save original methods.
const trackerAutorun = Tracker.autorun;
const meteorSubscribe = Meteor.subscribe;
const meteorCall = Meteor.call;
const mongoObserve = Mongo.Cursor.prototype.observe;
const mongoObserveChanges = Mongo.Cursor.prototype.observeChanges;

export function patchTrackerAutorun(autorun) {
  return function(runFunc: (computation: Tracker.Computation) => void,
                  options?: { onError?: Function }): Tracker.Computation {
    runFunc = wrapCallback(runFunc, this);
    const params = isPresent(options) ? [runFunc, options] : [runFunc];
    return autorun.apply(this, params);
  };
};

export function patchMeteorSubscribe(subscribe) {
  return function(...args): Meteor.SubscriptionHandle {
    let callback = args[args.length - 1];
    if (isMeteorCallbacks(callback)) {
      args[args.length - 1] = wrapCallback(callback, this);
    }
    return subscribe.apply(this, args);
  };
};

export function patchMeteorCall(call) {
  return function(...args): void {
    let callback = args[args.length - 1];
    if (isMeteorCallbacks(callback)) {
      args[args.length - 1] = wrapCallback(callback, this);
    }
    call.apply(this, args);
  };
}

export function patchCursorObserve(observe) {
  return function(callbacks: Mongo.ObserveCallbacks): Meteor.LiveQueryHandle {
    callbacks = wrapCallback(callbacks, this);
    return observe.call(this, callbacks);
  };
};

export function patchCursorObserveChanges(observeChanges) {
  return function(callbacks: Mongo.ObserveChangesCallbacks):
    Meteor.LiveQueryHandle {
    callbacks = wrapCallback(callbacks, this);
    return observeChanges.call(this, callbacks);
  };
}

export function patchMeteor() {
  Tracker.autorun = patchTrackerAutorun(Tracker.autorun);
  Meteor.subscribe = patchMeteorSubscribe(Meteor.subscribe);
  Meteor.call = patchMeteorCall(Meteor.call);
  Mongo.Cursor.prototype.observe = patchCursorObserve(
    Mongo.Cursor.prototype.observe);
  Mongo.Cursor.prototype.observeChanges = patchCursorObserveChanges(
    Mongo.Cursor.prototype.observeChanges);
};

export function unpatchMeteor() {
  Tracker.autorun = trackerAutorun;
  Meteor.subscribe = meteorSubscribe;
  Meteor.call = meteorCall;
  Mongo.Cursor.prototype.observe = mongoObserve;
  Mongo.Cursor.prototype.observeChanges = mongoObserveChanges;
};

patchMeteor();
