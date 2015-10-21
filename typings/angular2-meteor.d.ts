
/// <reference path="../../barbatus_angular2/typings/angular2.d.ts" />
/// <reference path="../../barbatus_angular2/typings/meteor/meteor.d.ts" />

declare module ngMeteor {
  class MeteorComponent {
    subscribe(name: string, ...rest: any[]);
    autorun(runFunc: Function, autoBind: boolean): void;
  }

  function bootstrap(appComponentType: /*Type*/ any, bindings?: Array<ng.Type | ng.Provider | any[]>): Promise<ng.ApplicationRef>;
}

declare module "angular2-meteor" {
  export = ngMeteor;
}
