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
    autorun(func: (c: Tracker.Computation) => any): Tracker.Computation;
    /**
     *  Method has the same notation as Meteor.subscribe:
     *    subscribe(name, [args1, args2], [callbacks])
     */
    subscribe(name: string, ...args: any[]): Meteor.SubscriptionHandle;
    call(name: string, ...args: any[]): any;
    ngOnDestroy(): void;
    private _prepArgs(args);
}
