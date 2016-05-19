'use strict';

import {OnDestroy} from '@angular/core';

import {isMeteorCallbacks, isCallbacksObject} from './utils';
import {PromiseQ} from './promise_q';

export class MeteorComponent implements OnDestroy {
  private _hAutoruns: Array<Tracker.Computation> = [];
  private _hSubscribes: Array<Meteor.SubscriptionHandle> = [];

  autorun(func: (c: Tracker.Computation) => any): Tracker.Computation {
    let hAutorun = Tracker.autorun(func);
    this._hAutoruns.push(hAutorun);

    return hAutorun;
  }

  /**
   *  Method has the same notation as Meteor.subscribe:
   *    subscribe(name, [args1, args2], [callbacks])
   */
  subscribe(name: string, ...args: any[]): Meteor.SubscriptionHandle {
    let subArgs = this._prepArgs(args);

    if (!Meteor.subscribe) {
      throw new Error(
        'Meteor.subscribe is not defined on the server side');
    };

    let hSubscribe = Meteor.subscribe(name, ...subArgs);

    if (Meteor.isClient) {
      this._hSubscribes.push(hSubscribe);
    };

    if (Meteor.isServer) {
      let callback = subArgs[subArgs.length - 1];
      if (_.isFunction(callback)) {
        callback();
      }

      if (isCallbacksObject(callback)) {
        callback.onReady();
      }
    }

    return hSubscribe;
  }

  call(name: string, ...args) {
    let callArgs = this._prepArgs(args);

    return Meteor.call(name, ...callArgs);
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

  private _prepArgs(args) {
    let lastParam = args[args.length - 1];
    let penultParam = args[args.length - 2];

    // To be backward compatible.
    if (_.isBoolean(lastParam) &&
        isMeteorCallbacks(penultParam)) {
      args.pop();
    }

    lastParam = args[args.length - 1];
    if (isMeteorCallbacks(lastParam)) {
      args[args.length - 1] = PromiseQ.wrapPush(lastParam);
    }

    return args;
  }
}
