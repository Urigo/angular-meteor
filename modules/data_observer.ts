'use strict';

import {
  CallbacksObject,
  MeteorCallbacks,
  isMeteorCallbacks,
  isCallbacksObject,
  check,
  Match
} from './utils';

/**
 * A helper class for data loading events. 
 * For example, used in @MeteorComponent to wrap callbacks
 * of the Meteor methods whic allows us to know when
 * requested data is available on the client.
 */
export class DataObserver {
  private static _promises: Array<Promise<any>> = [];

  static pushCb(callbacks: MeteorCallbacks): MeteorCallbacks {
    check(callbacks, Match.Where(isMeteorCallbacks));

    const dequeue = (promise) => {
      let index = this._promises.indexOf(promise);
      if (index !== -1) {
        this._promises.splice(index, 1);
      }
    };
    const queue = (promise) => {
      this._promises.push(promise);
    };

    if (isCallbacksObject(callbacks)) {
      let origin = <CallbacksObject>callbacks;
      let newCallbacks;
      let promise = new Promise((resolve) => {
        newCallbacks = <CallbacksObject>{
          onError: (err) => {
            if (origin.onError) {
              origin.onError(err);
            }
            resolve({ err });
            dequeue(promise);
          },

          onReady: (result) => {
            if (origin.onReady) {
              origin.onReady(result);
            }
            resolve({ result });
            dequeue(promise);
          },

          onStop: (err) => {
            if (origin.onStop) {
              origin.onStop(err);
            }
            resolve({ err });
            dequeue(promise);
          }
        }
      });

      queue(promise);

      return newCallbacks;
    }

    let newCallback;
    let promise = new Promise((resolve) => {
      newCallback = (err, result) => {
        (<Function>callbacks)(err, result);
        resolve({ err, result });
        dequeue(promise);
      };
    });

    queue(promise);

    return newCallback;
  }

  static onSubsReady(cb: Function): void {
    check(cb, Function);

    new Promise((resolve, reject) => {
      const poll = Meteor.setInterval(() => {
        if (DDP._allSubscriptionsReady()) {
          Meteor.clearInterval(poll);
          resolve();
        }
      }, 100);
    }).then(() => cb());
  }

  static onReady(cb: Function): void {
    check(cb, Function);

    Promise.all(this._promises).then(() => cb());
  }

  static cbLen(): number {
    return this._promises.length;
  }
}
