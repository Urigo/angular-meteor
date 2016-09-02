import { OnDestroy } from '@angular/core';
/**
 * A basic class to extend @Component and @Pipe.
 * Contains wrappers over main Meteor methods
 * that does some maintenance work behind the scene:
 * - Destroys subscription handles
 *   when the component or pipe is destroyed by Angular 2.
 * - Debounces ngZone runs reducing number of
 *   change detection runs.
 */
export declare class MeteorReactive implements OnDestroy {
    private _hAutoruns;
    private _hSubscribes;
    private _ngZone;
    /**
     * Method has the same notation as Meteor.autorun
     * except the last parameter.
     * @param func Callback to be executed when
     *   current computation is invalidated.
     * @param autoBind Determine whether Angular 2 zone will run
     *   after the func call to initiate change detection.
     */
    autorun(func: (c: Tracker.Computation) => any, autoBind?: Boolean): Tracker.Computation;
    /**
     *  Method has the same notation as Meteor.subscribe:
     *    subscribe(name, [args1, args2], [callbacks], [autoBind])
     *  except the last autoBind param (see autorun above).
     */
    subscribe(name: string, ...args: any[]): Meteor.SubscriptionHandle;
    call(name: string, ...args: any[]): any;
    ngOnDestroy(): void;
    private _prepArgs(args);
}
export declare const MeteorComponent: typeof MeteorReactive;
