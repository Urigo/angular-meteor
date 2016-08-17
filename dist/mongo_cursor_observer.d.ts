import { EventEmitter } from '@angular/core';
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
export declare type MongoDocChange = AddChange | MoveChange | UpdateChange | RemoveChange;
/**
 * Class that does a background work of observing
 * Mongo collection changes (through a cursor)
 * and notifying subscribers about them.
 */
export declare class MongoCursorObserver extends EventEmitter<MongoDocChange[]> {
    private _debounceMs;
    private _added;
    private _lastChanges;
    private _cursor;
    private _hCursor;
    private _ngZone;
    private _isSubscribed;
    static isCursor(cursor: any): boolean;
    constructor(cursor: Mongo.Cursor<any>, _debounceMs?: number);
    subscribe(events: any): any;
    lastChanges: (AddChange | MoveChange | UpdateChange | RemoveChange)[];
    destroy(): void;
    private _processCursor(cursor);
    private _startCursorObserver(cursor);
    private _updateAt(doc, index);
    private _addAt(doc, index);
    private _moveTo(doc, fromIndex, toIndex);
    private _removeAt(index);
}
