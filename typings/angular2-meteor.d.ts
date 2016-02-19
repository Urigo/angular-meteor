/// <reference path="../angular2/angular2.d.ts" />

declare module "angular2-meteor" {
  import * as core from 'angular2/core';

  class MeteorComponent {
    subscribe(name: string, ...rest: any[]): Meteor.SubscriptionHandle;
    autorun(runFunc: Function, autoBind?: boolean): Tracker.Computation;
    call(name: string, ...rest: any[]);
    ngOnDestroy():void;
    MeteorApp(args?: {}): (cls: core.Type) => any;
  }

  function bootstrap(appComponentType: /*Type*/ any, bindings?: Array<core.Type | core.Provider | any[]>): Promise<core.ApplicationRef>;
}
