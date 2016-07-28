import { Observable } from "rxjs/Rx";
import { Mongo } from 'meteor/mongo';
export declare function toObservable<T>(cursor: Mongo.Cursor<T>): Observable<Array<T>>;
