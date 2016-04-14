export declare type CallbacksObject = {
    onReady?: Function;
    onError?: Function;
    onStop?: Function;
};
export declare type MeteorCallbacks = ((...args) => any) | CallbacksObject;
export declare const subscribeEvents: string[];
export declare function isMeteorCallbacks(callbacks: any): boolean;
export declare function isCallbacksObject(callbacks: any): boolean;
