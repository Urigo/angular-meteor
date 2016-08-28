import {Observable, Subscriber} from 'rxjs';

import {ObservableCursor} from './observable-cursor';

import Selector = Mongo.Selector;
import ObjectID = Mongo.ObjectID;
import SortSpecifier = Mongo.SortSpecifier;
import FieldSpecifier = Mongo.FieldSpecifier;
import Modifier = Mongo.Modifier;

import 'rxjs/add/operator/debounce';

export module MongoObservable {
  'use strict';

  export interface ConstructorOptions {
    connection?: Object;
    idGeneration?: string;
    transform?: Function;
  }

  export interface AllowDenyOptionsObject<T> {
    insert?: (userId: string, doc: T) => boolean;
    update?: (userId: string, doc: T, fieldNames: string[], modifier: any) => boolean;
    remove?: (userId: string, doc: T) => boolean;
    fetch ?: string[];
    transform ? : Function;
  }

  export class Collection<T> {
    private _collection: Mongo.Collection<T>;

    constructor(name: string, options?: ConstructorOptions) {
      this._collection = new Mongo.Collection<T>(name, options);
    }

    get collection(): Mongo.Collection<T> {
      return this._collection;
    }

    allow(options: AllowDenyOptionsObject<T>): boolean {
      return this._collection.allow(options);
    }

    deny(options: AllowDenyOptionsObject<T>): boolean {
      return this._collection.deny(options);
    }

    rawCollection(): any {
      return this._collection.rawCollection();
    }

    rawDatabase(): any {
      return this._collection.rawDatabase();
    }

    insert(doc: T): Observable<string> {
      let observers: Subscriber<string>[] = [];
      let obs = this._createObservable<string>(observers);

      this._collection.insert(doc,
        (error: Meteor.Error, docId: string) => {
          observers.forEach(observer => {
            error ? observer.error(error) :
              observer.next(docId);
            observer.complete();
          });
        });
      return obs;
    }

    remove(selector: Selector | ObjectID | string): Observable<number> {
      let observers: Subscriber<number>[] = [];
      let obs = this._createObservable<number>(observers);

      this._collection.remove(selector,
        (error: Meteor.Error, removed: number) => {
          observers.forEach(observer => {
            error ? observer.error(error) :
              observer.next(removed);
            observer.complete();
          });
        });

      return obs;
    }

    update(
      selector: Selector | ObjectID | string,
      modifier: Modifier,
      options?: { multi?: boolean; upsert?: boolean; }): Observable<number> {
      let observers: Subscriber<number>[] = [];
      let obs = this._createObservable<number>(observers);

      this._collection.update(selector, modifier, options,
        (error: Meteor.Error, updated: number) => {
          observers.forEach(observer => {
            error ? observer.error(error) :
              observer.next(updated);
            observer.complete();
          });
        });

      return obs;
    }

    upsert(
      selector: Selector | ObjectID | string,
      modifier: Modifier,
      options?: { multi?: boolean; }): Observable<number> {
      let observers: Subscriber<number>[] = [];
      let obs = this._createObservable<number>(observers);

      this._collection.upsert(selector, modifier, options,
        (error: Meteor.Error, affected: number) => {
          observers.forEach(observer => {
            error ? observer.error(error) :
              observer.next(affected);
            observer.complete();
          });
        });

      return obs;
    }

    find(selector?: Selector | ObjectID | string, options?: {
      sort?: SortSpecifier;
      skip?: number;
      limit?: number;
      fields?: FieldSpecifier;
      reactive?: boolean;
      transform?: Function;
    }): ObservableCursor<T> {
      const cursor = this._collection.find(selector, options);
      return ObservableCursor.create<T>(cursor);
    }

    findOne(selector?: Selector | ObjectID | string, options?: {
      sort?: SortSpecifier;
      skip?: number;
      fields?: FieldSpecifier;
      reactive?: boolean;
      transform?: Function;
    }): T {
      return this._collection.findOne(selector, options);
    }

    private _createObservable<T>(observers: Subscriber<T>[]) {
      return Observable.create((observer: Subscriber<T>) => {
         observers.push(observer);
         return () => {
           let index = observers.indexOf(observer);
           if (index !== -1) {
             observers.splice(index, 1);
           }
         };
      });
    }
  }
}
