import { Observable } from 'rxjs';
import { ObservableCursor } from './observable-cursor';
import Selector = Mongo.Selector;
import ObjectID = Mongo.ObjectID;
import SortSpecifier = Mongo.SortSpecifier;
import FieldSpecifier = Mongo.FieldSpecifier;
import Modifier = Mongo.Modifier;
import 'rxjs/add/operator/debounce';
export declare module MongoObservable {
    interface ConstructorOptions {
        connection?: Object;
        idGeneration?: string;
        transform?: Function;
    }
    interface AllowDenyOptionsObject<T> {
        insert?: (userId: string, doc: T) => boolean;
        update?: (userId: string, doc: T, fieldNames: string[], modifier: any) => boolean;
        remove?: (userId: string, doc: T) => boolean;
        fetch?: string[];
        transform?: Function;
    }
    class Collection<T> {
        private _collection;
        constructor(name: string, options?: ConstructorOptions);
        collection: Mongo.Collection<T>;
        allow(options: AllowDenyOptionsObject<T>): boolean;
        deny(options: AllowDenyOptionsObject<T>): boolean;
        rawCollection(): any;
        rawDatabase(): any;
        insert(doc: T): Observable<string>;
        remove(selector: Selector | ObjectID | string): Observable<number>;
        update(selector: Selector | ObjectID | string, modifier: Modifier, options?: {
            multi?: boolean;
            upsert?: boolean;
        }): Observable<number>;
        upsert(selector: Selector | ObjectID | string, modifier: Modifier, options?: {
            multi?: boolean;
        }): Observable<number>;
        find(selector?: Selector | ObjectID | string, options?: {
            sort?: SortSpecifier;
            skip?: number;
            limit?: number;
            fields?: FieldSpecifier;
            reactive?: boolean;
            transform?: Function;
        }): ObservableCursor<T>;
        findOne(selector?: Selector | ObjectID | string, options?: {
            sort?: SortSpecifier;
            skip?: number;
            fields?: FieldSpecifier;
            reactive?: boolean;
            transform?: Function;
        }): T;
        private _createObservable<T>(observers);
    }
}
