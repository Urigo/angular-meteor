import {Observable, Subscriber} from "rxjs/Rx";

function isFunction(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
}

export class MeteorObservable {
  static call<T>(name: string, ...args: any[]) : Observable<T>{
    const args : Array<any> = Array.prototype.slice.call(arguments);
    const lastParam = args[args.length - 1];

    if (lastParam && isFunction(lastParam))
      throw new Error("Invalid MeteorObservable.call arguments: your last param can't be a callback function, please remove it and use `.subscribe` of the Observable!");

    return Observable.create((observer : Subscriber) => {
      Meteor.call.apply(Meteor, args.concat([
        (error : any, result : any) => {
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