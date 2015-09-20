
/// <reference path="../../barbatus_angular2/typings/all.d.ts" />

declare module ngMeteor {
  class MeteorComponent {
    subscribe(name: string, ...rest: any[]);
    autorun(runFunc: Function, autoBind: boolean): void;
  }

  function bootstrap(appComponentType: /*Type*/ any, componentInjectableBindings?: Array<ng.Type | ng.Binding | any[]>): Promise<ng.ApplicationRef>;
}

declare module "angular2-meteor" {
  export = ngMeteor;
}
