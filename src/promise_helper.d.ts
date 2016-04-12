import { MeteorCallbacks } from './utils';
export declare class PromiseHelper {
    private static _promises;
    static wrap(callbacks: MeteorCallbacks): MeteorCallbacks;
    static onDone(done: any): void;
}
