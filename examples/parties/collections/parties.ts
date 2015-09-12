export var Parties = new Mongo.Collection('parties');

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
