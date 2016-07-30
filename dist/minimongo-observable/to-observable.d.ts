import { Observable } from 'rxjs/Rx';
export declare function toObservable<T>(cursor: Mongo.Cursor<T>): Observable<Array<T>>;
