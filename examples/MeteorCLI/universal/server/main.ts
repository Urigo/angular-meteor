import '../imports/polyfills';

import '../imports/methods/todos';
import '../imports/publications/todos';

import { Meteor } from 'meteor/meteor';
import { onPageLoad, Sink } from 'meteor/server-render';

import { enableProdMode, ApplicationRef } from '@angular/core';
import { ResourceLoader } from '@angular/compiler';
import { ɵgetDOM as getDOM } from '@angular/platform-browser';
import { platformDynamicServer, INITIAL_CONFIG, PlatformState } from '@angular/platform-server';

import { ServerAppModule } from '../imports/app/server-app.module';

Meteor.startup(() => {

  // Enable Angular's production mode if Meteor is in production mode
  if (Meteor.isProduction) {
    enableProdMode();
  }

  // When page requested
  onPageLoad(async (sink: Sink) => {

    sink.appendToHead('<base href="/">');
    sink.appendToBody('<app></app>');


    // Handle Angular's error, but do not prevent client bootstrap
    try {

      // Integrate Angular's router with Meteor
      const url = sink.request.url;

      // Get rendered document
      const platform = platformDynamicServer([
        {
          provide: INITIAL_CONFIG,
          useValue: {
            // Initial document
            document: sink.head + sink.body,
            url
          }
        }
      ]);

      const appModuleRef = await platform.bootstrapModule(ServerAppModule, {
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

      const applicationRef: ApplicationRef = appModuleRef.injector.get(ApplicationRef);

      await applicationRef.isStable.first(isStable => isStable == true).toPromise();

      const platformState: PlatformState = appModuleRef.injector.get(PlatformState);

      const document: Document = platformState.getDocument();

      // Extract head
      sink.head = getDOM().getInnerHTML(document.head);

      // Extract body
      sink.body = getDOM().getInnerHTML(document.body);

    } catch (e) {

      // Write errors to console
      console.error('Angular SSR Error: ' + e.stack || e);

    }


  });

});
