DummyCollection = new Meteor.Collection(null);

DummyCollection.allow({
  remove: function() {
    return true;
  },
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  }
});
