'use strict';

import {noop} from '@angular/core/src/facade/lang';
import {Meteor} from 'meteor/meteor';
import {Tracker} from 'meteor/tracker';
import {Mongo} from 'meteor/mongo';
import {isMeteorCallbacks, g, gZone, Zone} from './utils';

let tHandler = null;
let zones: Zone[] = [];

function runZones() {
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

let runZonesTask;
function scheduleZonesRun() {
  if (runZonesTask) {
    runZonesTask.cancelFn();
  }

  runZonesTask = gZone.scheduleMacroTask('runZones', runZones, null,
    task => {
      tHandler = setTimeout(task.invoke);
    }, () => {
      clearTimeout(tHandler);
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

const autorun = Tracker.autorun;
export function TrackerAutorun(runFunc: (computation: Tracker.Computation) => void,
                               options?: {onError?: Function}): Tracker.Computation {
  runFunc = wrapCallback(runFunc, this);
  return autorun.call(this, runFunc, options);
};
Tracker.autorun = TrackerAutorun;

const subscribe = Meteor.subscribe;
export function MeteorSubscribe(...args): Meteor.SubscriptionHandle {
  let callback = args[args.length - 1];

  if (isMeteorCallbacks(callback)) {
    args[args.length - 1] = wrapCallback(callback, this);
  }

  return subscribe.apply(this, args);
};
Meteor.subscribe = MeteorSubscribe;

const call = Meteor.call;
export function MeteorCall(...args): void {
  let callback = args[args.length - 1];

  if (isMeteorCallbacks(callback)) {
    args[args.length - 1] = wrapCallback(callback, this);
  }

  call.apply(this, args);
};
Meteor.call = MeteorCall;

const observe = Mongo.Cursor.prototype.observe;
export function CursorObserve(callbacks: Mongo.ObserveCallbacks): Meteor.LiveQueryHandle {
    callbacks = wrapCallback(callbacks, this);
    return observe.call(this, callbacks);
  };
Mongo.Cursor.prototype.observe = CursorObserve;

const observeChanges = Mongo.Cursor.prototype.observeChanges;
export function CursorObserveChanges(callbacks: Mongo.ObserveChangesCallbacks):
  Meteor.LiveQueryHandle {
    callbacks = wrapCallback(callbacks, this);
    return observeChanges.call(this, callbacks);
  };
Mongo.Cursor.prototype.observeChanges = CursorObserveChanges;
