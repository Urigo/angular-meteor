import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
export declare class CursorHandle {
    private _hAutoNotify;
    private _hCurObserver;
    constructor(hCurObserver: Meteor.LiveQueryHandle, hAutoNotify?: Tracker.Computation);
    stop(): void;
}
