'use strict';

import {provide, IterableDiffers} from '@angular/core';
import {MongoCursorDifferFactory} from './mongo_cursor_differ';

import {defaultIterableDiffers} from '@angular/core/src/change_detection/change_detection';

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

export const METEOR_PROVIDERS: Array<any> = meteorProviders();
