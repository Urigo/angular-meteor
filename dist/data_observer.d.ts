import { MeteorCallbacks } from './utils';
/**
 * A helper class for data loading events.
 * For example, used in @MeteorComponent to wrap callbacks
 * of the Meteor methods whic allows us to know when
 * requested data is available on the client.
 */
export declare class DataObserver {
    private static _promises;
    static pushCb(callbacks: MeteorCallbacks): MeteorCallbacks;
    static onSubsReady(cb: Function): void;
    static onReady(cb: Function): void;
    static cbLen(): number;
}
