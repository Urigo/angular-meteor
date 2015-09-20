/// <reference path="../typings/all.d.ts" />

import {Parties} from 'collections/parties';

Meteor.publish('parties', function(location: string) {
  var selector = { location: location };
  return Parties.find(selector);
});

Meteor.publish('party', function(partyId: string) {
  return Parties.find(partyId);
});
