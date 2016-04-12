import {CallbacksObject, MeteorCallbacks, isCallbacksObject} from './utils';

export class PromiseHelper {
  private static _promises: Array<Promise<any>> = [];

  static wrap(callbacks: MeteorCallbacks): MeteorCallbacks {
    if (isCallbacksObject(callbacks)) {
      let calObject = <CallbacksObject>callbacks;
      let object = <CallbacksObject>{};
      let promise = new Promise<any>((resolve, reject) => {
        object.onReady = (result) => {
          calObject.onReady(result);
          resolve(result);
        };

        object.onError = (err) => {
          calObject.onError(err);
          resolve(err);
        };

        object.onStop = (err) => {
          calObject.onStop(err);
          resolve(err);
        };

        let index = PromiseHelper._promises.indexOf(promise);
        if (index !== -1) {
          PromiseHelper._promises.splice(index, 1);
        }
      });

      PromiseHelper._promises.push(promise);

      return object;
    }

    let newCallback;
    let promise = new Promise<any>((resolve, reject) => {
      let callback = <Function>callbacks;
      newCallback = (err, result) => {
        callback(err, result);
        resolve({ err: err, result: result });
        let index = PromiseHelper._promises.indexOf(promise);
        if (index !== -1) {
          PromiseHelper._promises.splice(index, 1);
        }
      };
    });

    PromiseHelper._promises.push(promise);

    return newCallback;
  }

  static onDone(done) {
    Promise.all(PromiseHelper._promises).then(done);
  }
}
