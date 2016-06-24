export declare class ZoneRunScheduler {
    private _zoneTasks;
    private _onRunCbs;
    zoneRun(zone: Zone): Function;
    runZones(): void;
    _runAfterRunCbs(zone: Zone): void;
    scheduleRun(zone: Zone): void;
    onAfterRun(zone: Zone, cb: Function): void;
}
export declare const zoneRunScheduler: ZoneRunScheduler;
export declare function patchTrackerAutorun(autorun: any): (runFunc: (computation: Tracker.Computation) => void, options?: {
    onError?: Function;
}) => Tracker.Computation;
export declare function patchMeteorSubscribe(subscribe: any): (...args: any[]) => Meteor.SubscriptionHandle;
export declare function patchMeteorCall(call: any): (...args: any[]) => void;
export declare function patchCursorObserve(observe: any): (callbacks: Mongo.ObserveCallbacks) => Meteor.LiveQueryHandle;
export declare function patchCursorObserveChanges(observeChanges: any): (callbacks: Mongo.ObserveChangesCallbacks) => Meteor.LiveQueryHandle;
export declare function patchMeteor(): void;
export declare function unpatchMeteor(): void;
