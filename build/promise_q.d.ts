import { MeteorCallbacks } from './utils';
export declare class PromiseQ {
    private static _promises;
    static wrapPush(callbacks: MeteorCallbacks): MeteorCallbacks;
    static onAll(resolve: any): void;
    static len(): number;
}
