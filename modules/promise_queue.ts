import {CallbacksObject, MeteorCallbacks,
  isMeteorCallbacks, isCallbacksObject} from './utils';
import {PromiseWrapper, PromiseCompleter} from 'angular2/src/facade/promise';

declare const global;

Promise = Promise || (global && global.Promise);

export class PromiseQueue {
  private static _promises: Array<Promise<any>> = [];

  static wrapPush(callbacks: MeteorCallbacks): MeteorCallbacks {
    check(callbacks, Match.Where(isMeteorCallbacks));

    const completer: PromiseCompleter<any> = PromiseWrapper.completer();
    const dequeue = (promise) => {
      let index = PromiseQueue._promises.indexOf(promise);
      if (index !== -1) {
        PromiseQueue._promises.splice(index, 1);
      }
    };
    const queue = (promise) => {
      PromiseQueue._promises.push(promise);
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

  static onResolve(resolve): void {
    Promise.all(PromiseQueue._promises).then(resolve);
  }

  static len(): number {
    return PromiseQueue._promises.length;
  }
}
