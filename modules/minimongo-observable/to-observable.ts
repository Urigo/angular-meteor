import {Observable, Subscriber} from "rxjs/Rx";
import {Mongo} from 'meteor/mongo';

export function toObservable<T>(cursor : Mongo.Cursor<T>) : Observable<Array<T>> {
  return Observable.create((observer : Subscriber<Array<T>>) => {
    const handleChange = () => {
      observer.next(cursor.fetch());
    };

    let handler = cursor.observe({
      added: handleChange,
      changed: handleChange,
      removed: handleChange
    });

    return () => {
      handler.stop();
    }
  })
}