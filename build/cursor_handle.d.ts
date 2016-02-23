export declare class CursorHandle {
    private _cursor;
    private _hAutoNotify;
    private _hCurObserver;
    constructor(cursor: Mongo.Cursor<any>, hCurObserver: Meteor.LiveQueryHandle, hAutoNotify?: Tracker.Computation);
    stop(): void;
}
