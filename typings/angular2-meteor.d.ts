
/// <reference path="angular2.d.ts" />
/// <reference path="meteor/meteor.d.ts" />
/// <reference path="underscore/underscore.d.ts" />
/// <reference path="angular2/angular2.d.ts" />
/// <reference path="es6-promise/es6-promise.d.ts" />
/// <reference path="es6-shim/es6-shim.d.ts" />

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
