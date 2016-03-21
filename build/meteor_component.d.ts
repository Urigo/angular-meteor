import { OnDestroy, NgZone } from 'angular2/core';
export declare type CallbacksObject = {
    onReady?: Function;
    onError?: Function;
    onStop?: Function;
};
export declare type MeteorCallbacks = (...args) => any | CallbacksObject;
export declare class MeteorComponent implements OnDestroy {
    private _hAutoruns;
    private _hSubscribes;
    private _zone;
    /**
     * @param {NgZone} ngZone added for test purposes mostly.
     */
    constructor(ngZone?: NgZone);
    autorun(func: (c: Tracker.Computation) => any, autoBind?: boolean): Tracker.Computation;
    /**
     *  Method has the same notation as Meteor.subscribe:
     *    subscribe(name, [args1, args2], [callbacks], [autobind])
     *  except one additional last parameter,
     *  which binds [callbacks] to the ng2 zone.
     */
    subscribe(name: string, ...args: any[]): Meteor.SubscriptionHandle;
    call(name: string, ...args: any[]): any;
    _prepMeteorArgs(args: any): any;
    ngOnDestroy(): void;
    _bindToNgZone(callbacks: MeteorCallbacks): MeteorCallbacks;
}
