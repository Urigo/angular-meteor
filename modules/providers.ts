'use strict';

import {NgModule, Provider, IterableDiffers} from '@angular/core';

import {MongoCursorDifferFactory} from './mongo_cursor_differ';

function meteorProviders() {
  return [
    IterableDiffers.extend([new MongoCursorDifferFactory()])
  ];
}

export const METEOR_PROVIDERS: Array<Provider> = meteorProviders();

@NgModule({
  providers: METEOR_PROVIDERS
})
export class MeteorModule {}
