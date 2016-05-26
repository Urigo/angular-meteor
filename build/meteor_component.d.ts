import { OnDestroy } from '@angular/core';
/**
 * A class to extend in Angular 2 components.
 * Contains wrappers over main Meteor methods,
 * that does some maintenance work behind the scene.
 * For example, it destroys subscription handles
 * when the component is being destroyed itself.
 */
export declare class MeteorComponent implements OnDestroy {
    private _hAutoruns;
    private _hSubscribes;
    autorun(func: (c: Tracker.Computation) => any, autoBind?: Boolean): Tracker.Computation;
    /**
     *  Method has the same notation as Meteor.subscribe:
     *    subscribe(name, [args1, args2], [callbacks], [autoBind])
     *  except the last param which could be a boolean, and means
     *  whether Angular 2 zone will run after the callback
     *  to initiate a change detection cycle.
     */
    subscribe(name: string, ...args: any[]): Meteor.SubscriptionHandle;
    call(name: string, ...args: any[]): any;
    ngOnDestroy(): void;
    private _prepArgs(args);
}
