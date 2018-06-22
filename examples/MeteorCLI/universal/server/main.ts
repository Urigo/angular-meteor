import '../imports/polyfills';

import '../imports/methods/todos';
import '../imports/publications/todos';

import { Meteor } from 'meteor/meteor';
import { WebApp, WebAppInternals } from 'meteor/webapp';

import {
  enableProdMode,
  PlatformRef,
  ApplicationModule,
  ApplicationRef
} from '@angular/core';

import { ResourceLoader } from '@angular/compiler';
import { ɵgetDOM as getDOM } from '@angular/platform-browser';
import { platformDynamicServer, BEFORE_APP_SERIALIZED ,INITIAL_CONFIG, PlatformState } from '@angular/platform-server';

import { ServerAppModule } from '../imports/app/server-app.module';       

const HEAD_REGEX = /<head[^>]*>((.|[\n\r])*)<\/head>/im
const BODY_REGEX = /<body[^>]*>((.|[\n\r])*)<\/body>/im;

Meteor.startup(() => {

  // Enable Angular's production mode if Meteor is in production mode
  if (Meteor.isProduction) {
    enableProdMode();
  }

  // When page requested
  WebAppInternals.registerBoilerplateDataCallback('angular', async (request, data) => {

    let document,
        platformRef : PlatformRef;
    // Handle Angular's error, but do not prevent client bootstrap
    try {
      

      document = `
        <html>
          <head>
              <base href="/">
          </head>
          <body>
              <app></app>
          </body>
        </html>
      `;

      // Integrate Angular's router with Meteor
      const url = request.url;

      // Get rendered document
      platformRef = platformDynamicServer([
        {
          provide: INITIAL_CONFIG,
          useValue: {
            // Initial document
            document,
            url
          }
        }
      ]);

      const appModuleRef = await platformRef.bootstrapModule(ServerAppModule, {
        ngZone: 'noop',
        providers: [
          {
            provide: ResourceLoader,
            useValue: {
              get: Assets.getText
            },
            deps: []
          }
        ]
      });

      const applicationRef : ApplicationRef = appModuleRef.injector.get(ApplicationRef);

      await applicationRef.isStable
      .first(isStable => isStable == true)
      .toPromise();

      applicationRef.tick();

      // Run any BEFORE_APP_SERIALIZED callbacks just before rendering to string.
      const callbacks = appModuleRef.injector.get(BEFORE_APP_SERIALIZED, null);
      if (callbacks) {
        for (const callback of callbacks) {
          try {
            callback();
          } catch (e) {
            // Ignore exceptions.
            console.warn('Ignoring BEFORE_APP_SERIALIZED Exception: ', e);
          }
        }
      }

      const platformState: PlatformState = appModuleRef.injector.get(PlatformState);

      document = platformState.renderToString();

    } catch (e) {

      // Write errors to console
      console.error('Angular SSR Error: ' + e.stack || e);

    }finally{

      //Make sure platform is destroyed before rendering

      if(platformRef){
        platformRef.destroy();
      }
      const head = HEAD_REGEX.exec(document)[1];
      data.dynamicHead = head;
      const body = BODY_REGEX.exec(document)[1];
      data.dynamicBody = body;

    }
  })


});
