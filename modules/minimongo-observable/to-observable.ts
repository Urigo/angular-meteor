import {Subscriber} from 'rxjs/Rx';
import {ObservableCursor} from './observable-cursor';
import * as _ from 'lodash';

const COLLECTION_EVENTS_DEBOUNCE_TIMEFRAME = 16;

export function toObservable<T>(cursor : Mongo.Cursor<T>) : ObservableCursor<Array<T>> {
  const currentZone = Zone.current;
  const observable =
      ObservableCursor.create((observer : Subscriber<Array<T>>) => {
    const rawHandleChange = () => currentZone.run(() => observer.next(cursor.fetch()));
    const handleChange = _.debounce(
      rawHandleChange,
      COLLECTION_EVENTS_DEBOUNCE_TIMEFRAME);

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
