export declare function patchMeteorSubscribe(subscribe: any): (...args: any[]) => Meteor.SubscriptionHandle;
export declare function patchMeteorCall(call: any): (...args: any[]) => void;
export declare function patchMeteor(): void;
export declare function unpatchMeteor(): void;
