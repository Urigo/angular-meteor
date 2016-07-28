import {Observable, Subscriber} from "rxjs/Rx";

function isFunction(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
}

export class MeteorObservable {
  public static call<T>(name: string, ...args: any[]) : Observable<T>{
    const argumentsArray : Array<any> = Array.prototype.slice.call(arguments);
    const lastParam = argumentsArray[argumentsArray.length - 1];

    if (lastParam && isFunction(lastParam))
      throw new Error("Invalid MeteorObservable.call arguments: your last param can't be a callback function, please remove it and use `.subscribe` of the Observable!");

    return Observable.create((observer : Subscriber<Meteor.Error | T>) => {
      Meteor.call.apply(Meteor, argumentsArray.concat([
        (error : Meteor.Error, result : T) => {
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

      return () => {};
    });
  }
}