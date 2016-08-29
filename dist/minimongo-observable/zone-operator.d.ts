import { Observable } from 'rxjs';
export declare function zone<T>(zone?: Zone): Observable<T>;
export interface ZoneSignature<T> {
    (zone?: Zone): Observable<T>;
}
declare module 'rxjs/Observable' {
    interface Observable<T> {
        zone: ZoneSignature<T>;
    }
}
