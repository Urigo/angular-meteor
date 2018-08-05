import 'core-js/es7/reflect';
import 'zone.js';
import { Meteor } from "meteor/meteor";
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { AppModule } from './imports/app.module';

Meteor.startup(() => {
    platformBrowserDynamic().bootstrapModule(AppModule);
})