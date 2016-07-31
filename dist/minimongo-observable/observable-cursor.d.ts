import { Observable, Subscriber } from 'rxjs';
export declare class ObservableCursor<T> extends Observable<T> {
    _cursorRef: any;
    _reloadRef: any;
    private _isReactive;
    static create(subscribe?: <R>(subscriber: Subscriber<R>) => any): ObservableCursor<{}>;
    constructor(subscribe?: <R>(subscriber: Subscriber<R>) => any);
    nonReactive(): ObservableCursor<T>;
    isReactive(): boolean;
    getMongoCursor(): Mongo.Cursor<T>;
    reload(): ObservableCursor<T>;
}
