/// <reference path="../typings/all.d.ts" />

import {loadTestData} from './test_data';
export * from './pubs';

Meteor.startup(function() {
   loadTestData();
});
