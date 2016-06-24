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
/**
 * Class that does a background work of observing
 * Mongo collection changes (through a cursor)
 * and notifying subscribers about them.
 */
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
    destroy(): void;
    private _processCursor(cursor);
    private _startCursorObserver(cursor);
    private _updateAt(doc, index);
    private _addAt(doc, index);
    private _moveTo(doc, fromIndex, toIndex);
    private _removeAt(index);
}
