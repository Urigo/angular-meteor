/// <reference path="../typings/angular2-meteor.d.ts" />

'use strict';

import {provide, Type, Provider, IterableDiffers} from 'angular2/core';

import { bootstrap as ng2Bootstrap } from 'angular2/platform/browser';

import {defaultIterableDiffers} from 'angular2/src/core/change_detection/change_detection';

import {MongoCursorDifferFactory} from './mongo_cursor_differ';

function meteorProviders() {
  let providers = [];

  let factories = defaultIterableDiffers.factories;
  if (factories) {
    factories.push(new MongoCursorDifferFactory());
  }
  providers.push(provide(IterableDiffers, {
    useValue: new IterableDiffers(factories)
  }));

  return providers;
}

export const METEOR_PROVIDERS = meteorProviders();

export function bootstrap(appComponentType: any,
                          providers: Array<Type | Provider | any[]> = null) {
  ng2Bootstrap(appComponentType, [].concat(METEOR_PROVIDERS, providers || []));
}
