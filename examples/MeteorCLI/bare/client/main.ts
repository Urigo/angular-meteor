import './imports/polyfills';
import { Meteor } from 'meteor/meteor';

import { enableProdMode } from '@angular/core';
import { AppModule } from './imports/app/app.module';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

Meteor.startup( () => {

    if ( Meteor.isProduction ) {
        enableProdMode();
    }

    platformBrowserDynamic().bootstrapModule( AppModule ).then();

} );
