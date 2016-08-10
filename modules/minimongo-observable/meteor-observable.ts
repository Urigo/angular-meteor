import {Observable, Subscriber} from 'rxjs';
import {ObservableMeteorSubscription} from './observable-subscription';
import * as _ from 'lodash';

export class MeteorObservable {
  public static call<T>(name: string, ...args: any[]): Observable<T> {
    const currentZone = Zone.current;
    const argumentsArray: Array<any> = Array.prototype.slice.call(arguments);
    const lastParam = argumentsArray[argumentsArray.length - 1];

    if (lastParam && _.isFunction(lastParam)) {
      throw new Error(
        `Invalid MeteorObservable.call arguments:
         Your last param can't be a callback function, 
         please remove it and use ".subscribe" of the Observable!`);
    }

    const obs = Observable.create((observer: Subscriber<Meteor.Error | T>) => {
      Meteor.call.apply(Meteor, argumentsArray.concat([
        (error: Meteor.Error, result: T) => {
          if (error) {
            currentZone.run(() => {
              observer.error(error);
              observer.complete();
            });
          } else {
            currentZone.run(() => observer.next(result));
          }
        }
      ]));
    });

    obs.publish();

    return obs;
  }

  public static subscribe<T>(name: string, ...args: any[]): ObservableMeteorSubscription<T> {
    const currentZone = Zone.current;
    const argumentsArray: Array<any> = Array.prototype.slice.call(arguments);
    const lastParam = argumentsArray[argumentsArray.length - 1];

    if (lastParam && _.isObject(lastParam) && (lastParam.onReady || lastParam.onError)) {
      throw new Error(
        `Invalid MeteorObservable.subscribe arguments: 
        your last param can't be a callbacks object, 
        please remove it and use ".subscribe" of the Observable!`);
    }

    const observable =
      ObservableMeteorSubscription.create((observer: Subscriber<Meteor.Error | T>) => {
      let handle = Meteor.subscribe.apply(Meteor, argumentsArray.concat([
        {
          onError: (error: Meteor.Error) => {
            currentZone.run(() => {
              observer.error(error);
              observer.complete();
            });
          },
          onReady: () => {
            currentZone.run(() => observer.next());
          }
        }
      ]));

      observable._meteorSubscriptionRef = handle;

      return () => {
        if (handle && handle.stop) {
          try {
            handle.stop();
          } catch (e) {

          }
        }
      };
    });

    return <ObservableMeteorSubscription<T>>observable;
  }
}
