import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Mongo } from 'meteor/mongo';
export declare function runZones(): void;
export declare function patchTrackerAutorun(autorun: any): (runFunc: (computation: Tracker.Computation) => void, options?: {
    onError?: Function;
}) => Tracker.Computation;
export declare function patchMeteorSubscribe(subscribe: any): (...args: any[]) => Meteor.SubscriptionHandle;
export declare function patchMeteorCall(call: any): (...args: any[]) => void;
export declare function patchCursorObserve(observe: any): (callbacks: Mongo.ObserveCallbacks) => Meteor.LiveQueryHandle;
export declare function patchCursorObserveChanges(observeChanges: any): (callbacks: Mongo.ObserveChangesCallbacks) => Meteor.LiveQueryHandle;
export declare function patchMeteor(): void;
export declare function unpatchMeteor(): void;
