'use strict';

import {OnDestroy} from '@angular/core';

import {isMeteorCallbacks, isCallbacksObject, gZone, g, noop} from './utils';
import {wrapCallbackInZone} from './zone_utils';

/**
 * A basic class to extend @Component and @Pipe.
 * Contains wrappers over main Meteor methods
 * that does some maintenance work behind the scene:
 * - Destroys subscription handles
 *   when the component or pipe is destroyed by Angular 2.
 * - Debounces ngZone runs reducing number of
 *   change detection runs.
 */
export class MeteorReactive implements OnDestroy {
  private _hAutoruns: Array<Tracker.Computation> = [];
  private _hSubscribes: Array<Meteor.SubscriptionHandle> = [];
  private _ngZone = g.Zone.current;

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

    let hAutorun = Tracker.autorun(func);
    this._hAutoruns.push(hAutorun);

    return hAutorun;
  }

  /**
   *  Method has the same notation as Meteor.subscribe:
   *    subscribe(name, [args1, args2], [callbacks], [autoBind])
   *  except the last autoBind param (see autorun above).
   */
  subscribe(name: string, ...args: any[]): Meteor.SubscriptionHandle {
    let { pargs } = this._prepArgs(args);

    if (!Meteor.subscribe) {
      throw new Error(
        'Meteor.subscribe is not defined on the server side');
    };

    let hSubscribe = Meteor.subscribe(name, ...pargs);

    if (Meteor.isClient) {
      this._hSubscribes.push(hSubscribe);
    };

    if (Meteor.isServer) {
      let callback = pargs[pargs.length - 1];
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
    let { pargs } = this._prepArgs(args);

    return Meteor.call(name, ...pargs);
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
    let autoBind = true;

    if (_.isBoolean(lastParam) &&
        isMeteorCallbacks(penultParam)) {
      args.pop();
      autoBind = lastParam !== false;
    }

    lastParam = args[args.length - 1];
    if (isMeteorCallbacks(lastParam)) {
      args.pop();
    } else {
      lastParam = noop;
    }
    // If autoBind is set to false then
    // we run user's callback in the global zone
    // instead of the current Angular 2 zone.
    let zone = autoBind ? this._ngZone : gZone;
    lastParam = wrapCallbackInZone(zone, lastParam, this);
    args.push(lastParam);

    return { pargs: args, autoBind };
  }
}

// For the versions compatibility.
/* tslint:disable */
export const MeteorComponent = MeteorReactive;
