import * as core from "angular2/core";

declare namespace ngMeteor {
  class MeteorComponent {
    subscribe(name: string, ...rest: any[]): Meteor.SubscriptionHandle;
    autorun(runFunc: Function, autoBind?: boolean): Tracker.Computation;
    call(name: string, ...rest: any[]);
    ngOnDestroy():void;
  }

  function bootstrap(appComponentType: /*Type*/ any, bindings?: Array<core.Type | core.Provider | any[]>): Promise<core.ApplicationRef>;
}

export = ngMeteor;
