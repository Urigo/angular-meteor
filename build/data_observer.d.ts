import { MeteorCallbacks } from './utils';
export declare class DataObserver {
    private static _promises;
    static pushCb(callbacks: MeteorCallbacks): MeteorCallbacks;
    static onReady(resolve: any): void;
    static cbLen(): number;
}
