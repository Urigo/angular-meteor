/// <reference path="../typings/angular2-meteor.d.ts" />
/// <reference path="../typings/angular2.d.ts" />

'use strict';

import {provide, Type, Provider, IterableDiffers} from 'angular2/core';

import {bootstrap as ng2Bootstrap} from 'angular2/bootstrap';

import {defaultIterableDiffers} from 'angular2/src/core/change_detection/change_detection';

import {MongoCursorDifferFactory} from './mongo_cursor_differ';

export function bootstrap(appComponentType: any,
                          providers: Array<Type | Provider | any[]> = null) {
  /*
   let newProviders = [];
   let factories = defaultIterableDiffers.factories;
   if (factories) {
   factories.push(new MongoCursorDifferFactory());
   }

   newProviders.push(provide(IterableDiffers, {
   useValue: new IterableDiffers(factories)
   }));

   if (providers) {
   newProviders.push(providers);
   }
   */

  console.log(appComponentType);

  ng2Bootstrap(appComponentType);
}