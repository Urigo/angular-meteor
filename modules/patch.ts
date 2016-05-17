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
import {Meteor} from 'meteor/meteor';
import {Tracker} from 'meteor/tracker';
import {Mongo} from 'meteor/mongo';
import {isMeteorCallbacks, g, gZone, Zone} from './utils';

let tHandler = null;
let zones: Zone[] = [];
let runZonesTask = null;

export function runZones() {
  for (let zone of zones) {
    zone.run(noop);
  }
  zones = [];
}

function saveZone() {
  if (g.Zone.current !== gZone &&
      zones.indexOf(g.Zone.current) === -1) {
    zones.push(g.Zone.current);
  }
}

function scheduleZonesRun() {
  if (runZonesTask) {
    runZonesTask.cancelFn();
    runZonesTask = null;
  }

  runZonesTask = gZone.scheduleMacroTask('runZones', runZones, null,
    task => {
      tHandler = setTimeout(task.invoke);
    }, () => {
      clearTimeout(tHandler);
      runZonesTask = null;
    });
}

function wrapInZone(method: Function, context: any) {
  saveZone();
  return function(...args) {
    gZone.run(() => {
      method.apply(context, args);
    });
    scheduleZonesRun();
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
