import Selector = Mongo.Selector;
import ObjectID = Mongo.ObjectID;
import SortSpecifier = Mongo.SortSpecifier;
import FieldSpecifier = Mongo.FieldSpecifier;
import Modifier = Mongo.Modifier;
import {toObservable} from './to-observable';
import {ObservableCursor} from './observable-cursor';

export module MongoObservable {
  'use strict';

  export interface ConstructorOptions {
    connection ? : Object;
    idGeneration ? : string;
    transform ? : Function;
  }

  export interface AllowDenyOptionsObject<T> {
    insert ? : (userId: string, doc: T) => boolean;
    update ? : (userId: string, doc: T, fieldNames: string[], modifier: any) => boolean;
    remove ? : (userId: string, doc: T) => boolean;
    fetch ? : string[];
    transform ? : Function;
  }

  export class Collection<T> {
    private collection : Mongo.Collection<T>;

    constructor(name: string, options?: ConstructorOptions) {
      this.collection = new Mongo.Collection<T>(name, options);
    }

    allow(options: AllowDenyOptionsObject<T>) : boolean {
      return this.collection.allow.apply(this.collection, arguments);
    }

    deny(options: AllowDenyOptionsObject<T>) : boolean {
      return this.collection.deny.apply(this.collection, arguments);
    }

    insert(doc: T, callback ? : Function): string {
      return this.collection.insert.apply(this.collection, arguments);
    }

    rawCollection(): any {
      return this.collection.rawCollection.apply(this.collection, arguments);
    }

    getMongoCollection(): Mongo.Collection<T> {
      return this.collection;
    }

    rawDatabase(): any {
      return this.collection.rawDatabase.apply(this.collection, arguments);
    }

    remove(selector: Selector | ObjectID | string, callback ? : Function): number {
      return this.collection.remove.apply(this.collection, arguments);
    }

    update(
      selector: Selector | ObjectID | string,
      modifier: Modifier,
      options ? : {
        multi ? : boolean;
        upsert ? : boolean;
      },
      callback ? : Function): number {
      return this.collection.update.apply(this.collection, arguments);
    }

    upsert(
      selector: Selector | ObjectID | string,
      modifier: Modifier,
      options ? : {
        multi ? : boolean;
      },
      callback ? : Function): {
        numberAffected ? : number;
        insertedId ? : string;
      } {
      return this.collection.upsert.apply(this.collection, arguments);
    }

    find(selector ? : Selector | ObjectID | string, options ? : {
      sort ? : SortSpecifier;
      skip ? : number;
      limit ? : number;
      fields ? : FieldSpecifier;
      reactive ? : boolean;
      transform ? : Function;
    }) : ObservableCursor<Array<T>> {
      const cursor = this.collection.find.apply(this.collection, arguments);

      return toObservable<T>(cursor);
    }

    findOne(selector ? : Selector | ObjectID | string, options ? : {
      sort ? : SortSpecifier;
      skip ? : number;
      fields ? : FieldSpecifier;
      reactive ? : boolean;
      transform ? : Function;
    }): T {
      return this.collection.findOne.apply(this.collection, arguments);
    }
  }
}
