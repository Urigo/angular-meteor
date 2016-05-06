import { OnDestroy } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
export declare class MeteorComponent implements OnDestroy {
    private _hAutoruns;
    private _hSubscribes;
    private _zone;
    private _inZone;
    constructor();
    autorun(func: (c: Tracker.Computation) => any, autoBind?: boolean): Tracker.Computation;
    /**
     *  Method has the same notation as Meteor.subscribe:
     *    subscribe(name, [args1, args2], [callbacks], [autobind])
     *  except one additional last parameter,
     *  which binds [callbacks] to the ng2 zone.
     */
    subscribe(name: string, ...args: any[]): Meteor.SubscriptionHandle;
    call(name: string, ...args: any[]): any;
    ngOnDestroy(): void;
    private _prepMeteorArgs(args);
    private _runInZone(f);
    private _bindToNgZone(callbacks);
}
