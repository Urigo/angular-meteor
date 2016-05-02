'use strict';

import {provide, IterableDiffers} from 'angular2/core';
import {MongoCursorDifferFactory} from './mongo_cursor_differ';

import {defaultIterableDiffers} from 'angular2/src/core/change_detection/change_detection';
import {CONST_EXPR} from 'angular2/src/facade/lang';

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

export const METEOR_PROVIDERS: Array<any> = CONST_EXPR(meteorProviders());
