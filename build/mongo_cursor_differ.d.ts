import { ChangeDetectorRef, IterableDiffer } from "angular2/core";
import { DefaultIterableDifferFactory } from "angular2/src/core/change_detection/differs/default_iterable_differ";
import { MongoCursorObserver } from "./mongo_cursor_observer";
export interface ObserverFactory {
    create(cursor: Object): Object;
}
export declare class MongoCursorDifferFactory extends DefaultIterableDifferFactory {
    supports(obj: Object): boolean;
    create(cdRef: ChangeDetectorRef): MongoCursorDiffer;
}
export declare class MongoCursorDiffer implements IterableDiffer {
    private _inserted;
    private _removed;
    private _moved;
    private _updated;
    private _curObserver;
    private _lastChanges;
    private _listSize;
    private _cursor;
    private _obsFactory;
    private _subscription;
    constructor(cdRef: ChangeDetectorRef, obsFactory: ObserverFactory);
    forEachAddedItem(fn: Function): void;
    forEachMovedItem(fn: Function): void;
    forEachRemovedItem(fn: Function): void;
    forEachIdentityChange(fn: Function): void;
    diff(cursor: Mongo.Cursor<any>): this;
    onDestroy(): void;
    observer: MongoCursorObserver;
    _destroyObserver(): void;
    _updateLatestValue(changes: any): void;
    _reset(): void;
    _applyCleanup(): void;
    _applyChanges(changes: any): void;
    _createChangeRecord(currentIndex: any, prevIndex: any, item: any): any;
}
