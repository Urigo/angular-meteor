import {Subscriber} from 'rxjs/Rx';
import {ObservableCursor} from './observable-cursor';

export function toObservable<T>(cursor : Mongo.Cursor<T>) : ObservableCursor<Array<T>> {
  const observable =
      ObservableCursor.create((observer : Subscriber<Array<T>>) => {
    const handleChange = () => {
      observer.next(cursor.fetch());
    };

    let handler;
    let isReactive = observable.isReactive();
    observable._cursorRef = cursor;
    observable._reloadRef = handleChange;

    if (isReactive) {
      handler = cursor.observe({
        added: handleChange,
        changed: handleChange,
        removed: handleChange
      });
    } else {
      handleChange();
    }

    return () => {
      if (isReactive && handler && handler.stop) {
        handler.stop();
      }
    };
  });

  return <ObservableCursor<Array<T>>>observable;
}
