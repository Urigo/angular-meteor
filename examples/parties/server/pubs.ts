import {Parties} from 'collections/parties';

Meteor.publish('parties', function(location) {
  return Parties.find({location: location});
});

Meteor.publish('party', function(partyId) {
  return Parties.find(partyId);
});
