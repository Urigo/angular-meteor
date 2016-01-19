
/// <reference path="angular2.d.ts" />
/// <reference path="meteor/meteor.d.ts" />

declare module ngMeteor {
  class MeteorComponent {
    subscribe(name: string, ...rest: any[]): Meteor.SubscriptionHandle;
    autorun(runFunc: Function, autoBind?: boolean): Tracker.Computation;
    call(name: string, ...rest: any[]);
  }

  function bootstrap(appComponentType: /*Type*/ any, bindings?: Array<core.Type | core.Provider | any[]>): Promise<core.ApplicationRef>;
}

declare module "angular2-meteor" {
  export = ngMeteor;
}
