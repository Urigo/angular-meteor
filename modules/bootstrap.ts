/// <reference path="../typings/angular2-meteor.d.ts" />

'use strict';

import * as ng2 from 'angular2/angular2';

import {defaultIterableDiffers} from 'angular2/change_detection';

import {MongoCursorDifferFactory} from './mongo_cursor_differ';

export function bootstrap(appComponentType: any,
                          providers: Array<Type | Provider | any[]> = null) {
  let newProviders = [];
  let factories = defaultIterableDiffers.factories;
  if (factories) {
    factories.push(new MongoCursorDifferFactory());
  }

  newProviders.push(ng2.provide(ng2.IterableDiffers, {
    useValue: new ng2.IterableDiffers(factories)
  }));

  if (providers) {
    newProviders.push(providers);
  }

  ng2.bootstrap(appComponentType, newProviders);
}
