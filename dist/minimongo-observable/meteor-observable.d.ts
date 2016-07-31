import { Observable } from 'rxjs';
import { ObservableMeteorSubscription } from './observable-subscription';
export declare class MeteorObservable {
    static call<T>(name: string, ...args: any[]): Observable<T>;
    static subscribe<T>(name: string, ...args: any[]): ObservableMeteorSubscription<T>;
}
