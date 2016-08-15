export declare type CallbacksObject = {
    onReady?: Function;
    onError?: Function;
    onStop?: Function;
};
export declare type MeteorCallbacks = ((...args) => any) | CallbacksObject;
export declare const subscribeEvents: string[];
export declare function isMeteorCallbacks(callbacks: any): boolean;
export declare function isCallbacksObject(callbacks: any): boolean;
export declare const g: any;
export declare const gZone: any;
export declare const EJSON: any;
export declare const check: any;
export declare const Match: any;
export declare function debounce(func: any, wait: any, onInit: any): (...args: any[]) => any;
