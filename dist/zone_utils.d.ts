/**
 * Contains a set of methods to schedule Zone runs.
 * Supposed to be used mostly in @MeteorReactive to patch
 * Meteor methods' callbacks.
 * After patching, callbacks will be run in the global zone
 * (i.e. outside of Angular 2), at the same time,
 * a Angular 2 zone run will be scheduled in order to
 * initiate UI update. In order to reduce number of
 * UI updates caused by the callbacks near the same time,
 * zone runs are debounced.
 */
import { MeteorCallbacks } from './utils';
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
export declare function wrapCallbackInZone(zone: Zone, callback: MeteorCallbacks, context: any): MeteorCallbacks;
export declare function scheduleMicroTask(fn: Function): void;
