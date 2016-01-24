/// <reference path="../typings/underscore/underscore.d.ts" />

import {OnDestroy, NgZone, createNgZone} from 'angular2/core';

declare export type CallbacksObject = {
  onReady?: Function;
  onError?: Function;
  onStop?: Function;
}

declare export type MeteorCallbacks = () => any | CallbacksObject;

const subscribeEvents = ['onReady', 'onError', 'onStop'];

function isMeteorCallbacks(callbacks: any): boolean {
  return _.isFunction(callbacks) || isCallbacksObject(callbacks);
}

// Checks if callbacks of {@link CallbacksObject} type.
function isCallbacksObject(callbacks: any): boolean {
  return callbacks && subscribeEvents.some((event) => {
    return _.isFunction(callbacks[event]);
  });
};

export class MeteorComponent implements OnDestroy {
  private _hAutoruns: Array<Tracker.Computation> = [];
  private _hSubscribes: Array<Meteor.SubscriptionHandle> = [];
  private _zone: NgZone;

  /**
   * @param {NgZone} ngZone added for test purposes mostly.
   */
  constructor(ngZone?: NgZone) {
    this._zone = ngZone || createNgZone();
  }

  autorun(func: () => any, autoBind: boolean): Tracker.Computation {
    check(func, Function);

    let hAutorun = Tracker.autorun(autoBind ? this._bindToNgZone(func) : func);
    this._hAutoruns.push(hAutorun);

    return hAutorun;
  }

  /**
   *  Method has the same notation as Meteor.subscribe:
   *    subscribe(name, [args1, args2], [callbacks], [autobind])
   *  except one additional last parameter,
   *  which binds [callbacks] to the ng2 zone.
   */
  subscribe(name: string, ...args): Meteor.SubscriptionHandle {
    let subArgs = this._prepMeteorArgs(args.slice());

    let hSubscribe = Meteor.subscribe(name, ...subArgs);
    this._hSubscribes.push(hSubscribe);

    return hSubscribe;
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
        args[args.length - 2] = this._bindToNgZone(callbacks);
      }
      // Removes last params since its specific to MeteorComponent.
      args.pop();
    }

    return args;
  }

  ngOnDestroy() {
    for (let hAutorun of this._hAutoruns) {
      hAutorun.stop();
    }

    for (let hSubscribe of this._hSubscribes) {
      hSubscribe.stop();
    }

    this._hAutoruns = null;
    this._hSubscribes = null;
  }

  _bindToNgZone(callbacks: MeteorCallbacks): MeteorCallbacks {
    if (_.isFunction(callbacks)) {
      return () => this._zone.run(callbacks);
    }

    if (isCallbacksObject(callbacks)) {
      // Bind zone for each event.
      let newCallbacks = _.clone(callbacks);
      subscribeEvents.forEach(event => {
        if (newCallbacks[event]) {
          newCallbacks[event] = () => this._zone.run(callbacks[event]);
        }
      });
      return newCallbacks;
    }

    return callbacks;
  }
}
