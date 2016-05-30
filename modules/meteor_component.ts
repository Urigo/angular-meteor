'use strict';

import {OnDestroy} from '@angular/core';

import {noop} from '@angular/core/src/facade/lang';

import {isMeteorCallbacks, isCallbacksObject, gZone} from './utils';
import {DataObserver} from './data_observer';

/**
 * A class to extend in Angular 2 components.
 * Contains wrappers over main Meteor methods,
 * that does some maintenance work behind the scene.
 * For example, it destroys subscription handles
 * when the component is being destroyed itself.
 */
export class MeteorComponent implements OnDestroy {
  private _hAutoruns: Array<Tracker.Computation> = [];
  private _hSubscribes: Array<Meteor.SubscriptionHandle> = [];

  /**
   * Method has the same notation as Meteor.autorun
   * except the last parameter.
   * @param func Callback to be executed when
   *   current computation is invalidated.
   * @param autoBind Determine whether Angular 2 zone will run
   *   after the func call to initiate change detection.
   */
  autorun(func: (c: Tracker.Computation) => any,
          autoBind: Boolean = true): Tracker.Computation {
    let autorunCall = () => {
      return Tracker.autorun(func);
    };

    // If autoBind is set to false then
    // we run Meteor method in the global zone
    // instead of the current Angular 2 zone.
    let hAutorun = autoBind ? autorunCall() :
      gZone.run(autorunCall);

    this._hAutoruns.push(hAutorun);

    return hAutorun;
  }

  /**
   *  Method has the same notation as Meteor.subscribe:
   *    subscribe(name, [args1, args2], [callbacks], [autoBind])
   *  except the last autoBind param (see autorun above).
   */
  subscribe(name: string, ...args: any[]): Meteor.SubscriptionHandle {
    let subArgs = this._prepArgs(args);

    if (!Meteor.subscribe) {
      throw new Error(
        'Meteor.subscribe is not defined on the server side');
    };

    let subscribeCall = () => {
      return Meteor.subscribe(name, ...subArgs.args);
    };

    let hSubscribe = subArgs.autoBind ? subscribeCall() :
      gZone.run(subscribeCall);

    if (Meteor.isClient) {
      this._hSubscribes.push(hSubscribe);
    };

    if (Meteor.isServer) {
      let callback = subArgs[subArgs.args.length - 1];
      if (_.isFunction(callback)) {
        callback();
      }

      if (isCallbacksObject(callback)) {
        callback.onReady();
      }
    }

    return hSubscribe;
  }

  call(name: string, ...args: any[]) {
    let callArgs = this._prepArgs(args);

    let meteorCall = () => {
      Meteor.call(name, ...callArgs.args);
    };

    if (!callArgs.autoBind) {
      return gZone.run(meteorCall);
    }

    return meteorCall();
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

  private _prepArgs(args): { args: any[], autoBind: boolean} {
    let lastParam = args[args.length - 1];
    let penultParam = args[args.length - 2];
    let autoBind = true;

    if (_.isBoolean(lastParam) &&
        isMeteorCallbacks(penultParam)) {
      args.pop();
      autoBind = lastParam !== false;
    }

    lastParam = args[args.length - 1];
    if (isMeteorCallbacks(lastParam)) {
      // Push callback to the observer, so
      // that we can use onReady to know when
      // data is loaded. 
      args[args.length - 1] = DataObserver.pushCb(lastParam);
    } else {
      args.push(DataObserver.pushCb(noop));
    }

    return { args, autoBind };
  }
}
