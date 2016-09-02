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
