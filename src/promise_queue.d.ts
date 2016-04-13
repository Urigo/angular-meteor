import { MeteorCallbacks } from './utils';
export declare class PromiseQueue {
    private static _promises;
    static wrap(callbacks: MeteorCallbacks): MeteorCallbacks;
    static onResolve(resolve: any): void;
    static len(): number;
}
