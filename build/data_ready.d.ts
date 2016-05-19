import { MeteorCallbacks } from './utils';
export declare class DataReadyHelper {
    private static _promises;
    static pushCb(callbacks: MeteorCallbacks): MeteorCallbacks;
    static onAll(resolve: any): void;
    static len(): number;
}
