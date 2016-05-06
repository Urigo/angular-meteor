import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { CursorHandle } from './cursor_handle';
export declare class AddChange {
    index: number;
    item: any;
    constructor(index: number, item: any);
}
export declare class UpdateChange {
    index: number;
    item: any;
    constructor(index: number, item: any);
}
export declare class MoveChange {
    fromIndex: number;
    toIndex: number;
    constructor(fromIndex: number, toIndex: number);
}
export declare class RemoveChange {
    index: number;
    constructor(index: number);
}
export declare class Subscription {
    private _next;
    private _error;
    private _complete;
    private _isUnsubscribed;
    constructor(_next: Function, _error: Function, _complete: Function);
    onNext(value: any): void;
    unsubscribe(): void;
}
export declare class MongoCursorObserver {
    private _docs;
    private _added;
    private _lastChanges;
    private _hCursor;
    private _subs;
    private _isSubscribed;
    static isCursor(cursor: any): boolean;
    constructor(cursor: Mongo.Cursor<any>);
    lastChanges: (AddChange | MoveChange | UpdateChange | RemoveChange)[];
    /**
     * Subcribes to the Mongo cursor changes.
     *
     * Since it's possible that some changes that been already collected
     * before the moment someone subscribes to the observer,
     * we emit these changes, but only to the first ever subscriber.
     */
    subscribe({next, error, complete}: {
        next: any;
        error: any;
        complete: any;
    }): Subscription;
    emit(value: any): void;
    _startCursor(cursor: Mongo.Cursor<any>): CursorHandle;
    _startCursorObserver(cursor: Mongo.Cursor<any>): Meteor.LiveQueryHandle;
    _updateAt(doc: any, index: any): UpdateChange;
    _addAt(doc: any, index: any): AddChange;
    _moveTo(doc: any, fromIndex: any, toIndex: any): MoveChange;
    _removeAt(index: any): RemoveChange;
    destroy(): void;
}
