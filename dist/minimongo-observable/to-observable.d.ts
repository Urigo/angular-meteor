import { ObservableCursor } from './observable-cursor';
export declare function toObservable<T>(cursor: Mongo.Cursor<T>): ObservableCursor<Array<T>>;
