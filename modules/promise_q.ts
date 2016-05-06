'use strict';

import {Match, check} from 'meteor/check';
import {PromiseWrapper, PromiseCompleter} from '@angular/core/src/facade/async';

import {CallbacksObject, MeteorCallbacks,
  isMeteorCallbacks, isCallbacksObject} from './utils';

export class PromiseQ {
  private static _promises: Array<Promise<any>> = [];

  static wrapPush(callbacks: MeteorCallbacks): MeteorCallbacks {
    check(callbacks, Match.Where(isMeteorCallbacks));

    const completer: PromiseCompleter<any> = PromiseWrapper.completer();
    const dequeue = (promise) => {
      let index = this._promises.indexOf(promise);
      if (index !== -1) {
        this._promises.splice(index, 1);
      }
    };
    const queue = (promise) => {
      this._promises.push(promise);
    };

    const promise = completer.promise;
    if (isCallbacksObject(callbacks)) {
      let origin = <CallbacksObject>callbacks;
      let object = <CallbacksObject>{
        onError: (err) => {
          origin.onError(err);
          completer.resolve({ err });
          dequeue(promise);
        },

        onReady: (result) => {
          origin.onReady(result);
          completer.resolve({ result });
          dequeue(promise);
        },

        onStop: (err) => {
          origin.onStop(err);
          completer.resolve({ err });
          dequeue(promise);
        }
      };

      queue(promise);

      return object;
    }

    let newCallback = (err, result) => {
      (<Function>callbacks)(err, result);
      completer.resolve({ err, result });
      dequeue(promise);
    };

    queue(promise);

    return newCallback;
  }

  static onAll(resolve): void {
    Promise.all(this._promises).then(resolve);
  }

  static len(): number {
    return this._promises.length;
  }
}
