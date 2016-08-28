import { Observable, Subscriber } from 'rxjs';
export declare class ObservableMeteorSubscription<T> extends Observable<T> {
    static create<T>(subscribe?: (subscriber: Subscriber<T>) => any): ObservableMeteorSubscription<T>;
    constructor(subscribe?: (subscriber: Subscriber<T>) => any);
}
