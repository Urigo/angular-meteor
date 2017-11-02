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

Meteor.startup(() => {

  // Enable Angular's production mode if Meteor is in production mode
  if (Meteor.isProduction) {
    enableProdMode();
  }

  // When page requested
  WebApp.connectHandlers.use(async (request, response, next) => {

    let document,
        platformRef : PlatformRef;
    // Handle Angular's error, but do not prevent client bootstrap
    try {

      document = await WebAppInternals.getBoilerplate(request, WebApp.defaultArch);

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

      response.end(document);

    }
  })


});
