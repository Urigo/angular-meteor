import Selector = Mongo.Selector;
import ObjectID = Mongo.ObjectID;
import SortSpecifier = Mongo.SortSpecifier;
import FieldSpecifier = Mongo.FieldSpecifier;
import Modifier = Mongo.Modifier;
import { ObservableCursor } from './observable-cursor';
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
        private collection;
        constructor(name: string, options?: ConstructorOptions);
        allow(options: AllowDenyOptionsObject<T>): boolean;
        deny(options: AllowDenyOptionsObject<T>): boolean;
        insert(doc: T, callback?: Function): string;
        rawCollection(): any;
        getMongoCollection(): Mongo.Collection<T>;
        rawDatabase(): any;
        remove(selector: Selector | ObjectID | string, callback?: Function): number;
        update(selector: Selector | ObjectID | string, modifier: Modifier, options?: {
            multi?: boolean;
            upsert?: boolean;
        }, callback?: Function): number;
        upsert(selector: Selector | ObjectID | string, modifier: Modifier, options?: {
            multi?: boolean;
        }, callback?: Function): {
            numberAffected?: number;
            insertedId?: string;
        };
        find(selector?: Selector | ObjectID | string, options?: {
            sort?: SortSpecifier;
            skip?: number;
            limit?: number;
            fields?: FieldSpecifier;
            reactive?: boolean;
            transform?: Function;
        }): ObservableCursor<Array<T>>;
        findOne(selector?: Selector | ObjectID | string, options?: {
            sort?: SortSpecifier;
            skip?: number;
            fields?: FieldSpecifier;
            reactive?: boolean;
            transform?: Function;
        }): T;
    }
}
