import { Observable, Subscriber } from 'rxjs';
export declare class ObservableMeteorSubscription<T> extends Observable<T> {
    _meteorSubscriptionRef: Meteor.SubscriptionHandle;
    static create(subscribe?: <R>(subscriber: Subscriber<R>) => any): ObservableMeteorSubscription<{}>;
    constructor(subscribe?: <R>(subscriber: Subscriber<R>) => any);
    stop(): void;
}
