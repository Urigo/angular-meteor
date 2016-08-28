'use strict';

import {Observable, Subscriber} from 'rxjs';

import {isMeteorCallbacks} from '../utils';

function throwInvalidCallback(method: string) {
  throw new Error(
    `Invalid ${method} arguments:
     your last param can't be a callback function, 
     please remove it and use ".subscribe" of the Observable!`);
}

export class MeteorObservable {
  public static call<T>(name: string, ...args: any[]): Observable<T> {
    const lastParam = args[args.length - 1];

    if (isMeteorCallbacks(lastParam)) {
      throwInvalidCallback('MeteorObservable.call');
    }

    return Observable.create((observer: Subscriber<Meteor.Error | T>) => {
      Meteor.call(name, ...args.concat([
        (error: Meteor.Error, result: T) => {
          error ? observer.error(error) :
            observer.next(result);
          observer.complete();
        }
      ]));
    });
  }

  public static subscribe<T>(name: string, ...args: any[]): Observable<T> {
    const lastParam = args[args.length - 1];

    if (isMeteorCallbacks(lastParam)) {
      throwInvalidCallback('MeteorObservable.subscribe');
    }

    return Observable.create((observer: Subscriber<Meteor.Error | T>) => {
      let handler = Meteor.subscribe(name, ...args.concat([{
          onError: (error: Meteor.Error) => {
            observer.error(error);
            observer.complete();
          },
          onReady: () => {
            observer.next();
            observer.complete();
          }
        }
      ]));

      return () => handler.stop();
    });
  }
}
