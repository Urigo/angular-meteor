/// <reference path="../typings/angular2-meteor.d.ts" />
/// <reference path="../typings/socially.d.ts" />

export var Parties = new Mongo.Collection<Party>('parties');

Parties.allow({
  insert: function(userId, party) {
    return true;
  },
  update: function(userId, party, fields, modifier) {
    return true;
  },
  remove: function(userId, party) {
    return true;
  }
});
