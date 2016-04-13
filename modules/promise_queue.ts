import {CallbacksObject, MeteorCallbacks,
  isMeteorCallbacks, isCallbacksObject, newPromise} from './utils';

export class PromiseQueue {
  private static _promises: Array<Promise<any>> = [];

  static wrap(callbacks: MeteorCallbacks): MeteorCallbacks {
    check(callbacks, Match.Where(isMeteorCallbacks));

    if (isCallbacksObject(callbacks)) {
      let calObject = <CallbacksObject>callbacks;
      let object = <CallbacksObject>{};
      let promise = newPromise<any>((resolve, reject) => {
        object.onReady = (result) => {
          calObject.onReady(result);
          resolve({ result });
        };

        object.onError = (err) => {
          calObject.onError(err);
          resolve({ err });
        };

        object.onStop = (err) => {
          calObject.onStop(err);
          resolve({ err });
        };

        let index = PromiseQueue._promises.indexOf(promise);
        if (index !== -1) {
          PromiseQueue._promises.splice(index, 1);
        }
      });

      PromiseQueue._promises.push(promise);

      return object;
    }

    let newCallback;
    let promise = newPromise<any>((resolve, reject) => {
      let callback = <Function>callbacks;
      newCallback = (err, result) => {
        callback(err, result);
        resolve({ err, result });
        let index = PromiseQueue._promises.indexOf(promise);
        if (index !== -1) {
          PromiseQueue._promises.splice(index, 1);
        }
      };
    });

    PromiseQueue._promises.push(promise);

    return newCallback;
  }

  static onResolve(resolve) {
    Promise.all(PromiseQueue._promises).then(resolve);
  }

  static len() {
    return PromiseQueue._promises.length;
  }
}
