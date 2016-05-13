import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Mongo } from 'meteor/mongo';
export declare function TrackerAutorun(runFunc: (computation: Tracker.Computation) => void, options?: {
    onError?: Function;
}): Tracker.Computation;
export declare function MeteorSubscribe(...args: any[]): Meteor.SubscriptionHandle;
export declare function MeteorCall(...args: any[]): void;
export declare function CursorObserve(callbacks: Mongo.ObserveCallbacks): Meteor.LiveQueryHandle;
export declare function CursorObserveChanges(callbacks: Mongo.ObserveChangesCallbacks): Meteor.LiveQueryHandle;
