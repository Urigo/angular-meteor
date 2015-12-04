/// <reference path="../typings/angular2-meteor.d.ts" />
/// <reference path="../typings/underscore/underscore.d.ts" />

'use strict';

import {OnDestroy} from 'angular2/angular2';

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

    let hAutorun = Tracker.autorun(autoBind ? zone.bind(func) : func);
    this._hAutoruns.push(hAutorun);
  }

  /**
   *  Method has the same notation as Meteor.subscribe:
   *    subscribe(name, [args1, args2], [callbacks], [autobind])
   *  except one additional last parameter,
   *  which binds [callbacks] to the ng2 zone.
   */
  subscribe(name: string, ...args) {
    let subArgs = this._prepMeteorArgs(args.slice());

    let hSubscribe = Meteor.subscribe(name, ...subArgs);
    this._hSubscribes.push(hSubscribe);
  }

  call(name: string, ...args) {
    let callArgs = this._prepMeteorArgs(args.slice());

    return Meteor.call(name, ...callArgs);
  }

  _prepMeteorArgs(args) {
    let lastParam = args[args.length - 1];
    let penultParam = args[args.length - 2];

    if (_.isBoolean(lastParam) && isMeteorCallbacks(penultParam)) {
      let callbacks = <MeteorCallbacks>penultParam;
      let autobind = <boolean>lastParam;
      if (autobind) {
        args[args.length - 2] = bindZone(callbacks);
      }
      // Removes last params since its specific to MeteorComponent.
      args.pop();
    }

    return args;
  }

  onDestroy() {
    for (let hAutorun of this._hAutoruns) {
      hAutorun.stop();
    }

    for (let hSubscribe of this._hSubscribes) {
      hSubscribe.stop();
    }

    this._hAutoruns = null;
    this._hSubscribes = null;
  }
}

const subscribeEvents = ['onReady', 'onError', 'onStop'];

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
