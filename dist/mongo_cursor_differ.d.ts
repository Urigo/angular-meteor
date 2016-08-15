import { ChangeDetectorRef } from '@angular/core';
import { DefaultIterableDifferFactory, CollectionChangeRecord, DefaultIterableDiffer } from '@angular/core/src/change_detection/differs/default_iterable_differ';
import { MongoCursorObserver } from './mongo_cursor_observer';
export interface ObserverFactory {
    create(cursor: Object): Object;
}
export declare class MongoCursorDifferFactory extends DefaultIterableDifferFactory {
    supports(obj: Object): boolean;
    create(cdRef: ChangeDetectorRef): MongoCursorDiffer;
}
/**
 * A class that implements Angular 2's concept of differs for ngFor.
 * API consists mainly of diff method and methods like forEachAddedItem
 * that is being run on each change detection cycle to apply new changes if any.
 */
export declare class MongoCursorDiffer extends DefaultIterableDiffer {
    private _inserted;
    private _removed;
    private _moved;
    private _updated;
    private _changes;
    private _curObserver;
    private _lastChanges;
    private _forSize;
    private _cursor;
    private _obsFactory;
    private _sub;
    private _zone;
    constructor(cdRef: ChangeDetectorRef, obsFactory: ObserverFactory);
    forEachAddedItem(fn: Function): void;
    forEachMovedItem(fn: Function): void;
    forEachRemovedItem(fn: Function): void;
    forEachIdentityChange(fn: Function): void;
    forEachOperation(fn: Function): void;
    diff(cursor: Mongo.Cursor<any>): this;
    onDestroy(): void;
    observer: MongoCursorObserver;
    _destroyObserver(): void;
    _updateLatestValue(changes: any): void;
    _reset(): void;
    _applyCleanup(): void;
    _applyChanges(changes: any): void;
    _createChangeRecord(currentIndex: any, prevIndex: any, item: any): CollectionChangeRecord;
}
