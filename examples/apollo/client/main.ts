import 'core-js/proposals/reflect-metadata';
import 'zone.js';
import { Meteor } from "meteor/meteor";
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { AppModule } from './imports/app.module';

Meteor.startup(() => {
    platformBrowserDynamic().bootstrapModule(AppModule);
})