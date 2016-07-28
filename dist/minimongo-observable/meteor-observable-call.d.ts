import { Observable } from "rxjs/Rx";
export declare class MeteorObservable {
    static call<T>(name: string, ...args: any[]): Observable<T>;
}
