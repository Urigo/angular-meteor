'use strict';

import {NgModule, NgZone, Provider, IterableDiffers} from '@angular/core';

import {MeteorApp} from './meteor_app';

import {MongoCursorDifferFactory} from './mongo_cursor_differ';

function meteorProviders() {
  return [
    IterableDiffers.extend([new MongoCursorDifferFactory()]),
    {
      provide: MeteorApp,
      deps: [NgZone],
      useValue: ngZone => {
        return new MeteorApp(ngZone);
      }
    }
  ];
}

export const METEOR_PROVIDERS: Array<Provider> = meteorProviders();

@NgModule({
  providers: METEOR_PROVIDERS
})
export class MeteorModule {}
