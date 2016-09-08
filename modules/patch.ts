'use strict';

/**
 * Patches Meteor methods to watch for the data exchange
 * (with the help of @DataObserver) between the client and server.
 * Primarily to be used in the Angular 2 Universal integration,
 * which needs to know when requested data is available
 * on the client to start bootstraping.
 */

import {isMeteorCallbacks, noop} from './utils';
import {DataObserver} from './data_observer';

// Save original methods.
const meteorSubscribe = Meteor.subscribe;
const meteorCall = Meteor.call;

export function patchMeteorSubscribe(subscribe) {
  return function(...args): Meteor.SubscriptionHandle {
    let callback = args[args.length - 1];
    if (isMeteorCallbacks(callback)) {
      args[args.length - 1] = DataObserver.pushCb(callback);
    } else {
      args.push(DataObserver.pushCb(noop));
    }
    return subscribe.apply(this, args);
  };
};

export function patchMeteorCall(call) {
  return function(...args): void {
    let callback = args[args.length - 1];
    if (isMeteorCallbacks(callback)) {
      args[args.length - 1] = DataObserver.pushCb(callback);
    } else {
      args.push(DataObserver.pushCb(noop));
    }
    return call.apply(this, args);
  };
}

export function patchMeteor() {
  Meteor.subscribe = patchMeteorSubscribe(Meteor.subscribe);
  Meteor.call = patchMeteorCall(Meteor.call);
};

export function unpatchMeteor() {
  Meteor.subscribe = meteorSubscribe;
  Meteor.call = meteorCall;
};

patchMeteor();
