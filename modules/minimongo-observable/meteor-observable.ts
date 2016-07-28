import {Observable, Subscriber} from "rxjs/Rx";
import * as _ from "lodash";

export class MeteorObservable {
  public static call<T>(name:string, ...args:any[]):Observable<T> {
    const argumentsArray:Array<any> = Array.prototype.slice.call(arguments);
    const lastParam = argumentsArray[argumentsArray.length - 1];

    if (lastParam && _.isFunction(lastParam))
      throw new Error("Invalid MeteorObservable.call arguments: your last param can't be a callback function, please remove it and use `.subscribe` of the Observable!");

    return Observable.create((observer:Subscriber<Meteor.Error | T>) => {
      Meteor.call.apply(Meteor, argumentsArray.concat([
        (error:Meteor.Error, result:T) => {
          if (error) {
            observer.error(error);
            observer.complete();
          }
          else {
            observer.next(result);
            observer.complete();
          }
        }
      ]));
    });
  }

  public static subscribe<T>(name:string, ...args:any[]):Observable<T> {
    const argumentsArray:Array<any> = Array.prototype.slice.call(arguments);
    const lastParam = argumentsArray[argumentsArray.length - 1];

    if (lastParam && _.isObject(lastParam) && (lastParam.onReady || lastParam.onError))
      throw new Error("Invalid MeteorObservable.subscribe arguments: your last param can't be a callbacks object, please remove it and use `.subscribe` of the Observable!");

    return Observable.create((observer:Subscriber<Meteor.Error | T>) => {
      let handle = Meteor.subscribe.apply(Meteor, argumentsArray.concat([
        {
          onReady: () => {
            observer.next();
          },
          onError: (error : Meteor.Error) => {
            observer.error(error);
            observer.complete();
          }
        }
      ]));

      return () => {
        if (handle && handle.stop) {
          try {
            handle.stop();
          }
          catch(e) {

          }
        }
      };
    });
  }
}