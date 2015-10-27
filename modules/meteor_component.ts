/// <reference path="../typings/angular2-meteor.d.ts" />
/// <reference path="../typings/underscore/underscore.d.ts" />

'use strict';

import {OnDestroy, Inject, NgZone, PlatformRef, ApplicationRef, platform} from 'angular2/angular2';

import {MongoCursorDifferFactory} from './mongo_cursor_differ';

declare type CallbacksObject = {
  onReady?: Function;
  onError?: Function;
  onStop?: Function;
}

declare type MeteorCallbacks = Function | CallbacksObject;

export class MeteorComponent implements OnDestroy {
  private _hAutoruns: Array<Tracker.Computation> = [];
  private _hSubscribes: Array<Meteor.SubscriptionHandle> = [];

  autorun(func: Function, autoBind: boolean) {
    check(func, Function);

    var hAutorun = Tracker.autorun(autoBind ? zone.bind(func) : func);
    this._hAutoruns.push(hAutorun);
  }

  subscribe(name: string, ...args /*, callback|callbacks, autobind*/) {
    var lastParam = args[args.length - 1];
    let lastLastParam = args[args.length - 2];

    if (_.isBoolean(lastParam) && isMeteorCallbacks(lastLastParam)) {
      let callbacks = <MeteorCallbacks>lastLastParam;
      let autobind = <boolean>lastParam;
      if (autobind) {
        args[args.length - 2] = bindZone(callbacks);
      }
      // Removes last params since its specific
      // to MeteorComponent.
      args.pop();
    }

    var hSubscribe = Meteor.subscribe(name, ...args);
    this._hSubscribes.push(hSubscribe);
  }

  onDestroy() {
    for (var hAutorun of this._hAutoruns) {
      hAutorun.stop();
    }
    for (var hSubscribe of this._hSubscribes) {
      hSubscribe.stop();
    }

    this._hAutoruns = null;
    this._hSubscribes = null;
  }
}

var subscribeEvents = ['onReady', 'onError', 'onStop'];

function bindZone(callbacks: MeteorCallbacks): MeteorCallbacks {
  var bind = zone.bind.bind(zone);

  if (_.isFunction(callbacks)) {
    return bind(callbacks);
  }

  if (isCallbacksObject(callbacks)) {
    // Bind zone for each event.
    subscribeEvents.forEach(event => {
      if (callbacks[event]) {
        callbacks[event] = bind(callbacks[event]);
      }
    });
  }

  return callbacks;
};

function isMeteorCallbacks(callbacks: any): boolean {
  return _.isFunction(callbacks) || isCallbacksObject(callbacks);
}

// Checks if callbacks of {@link CallbacksObject} type.
function isCallbacksObject(callbacks: any): boolean {
  return callbacks && subscribeEvents.some((event) => {
    return _.isFunction(callbacks[event]);
  });
};
