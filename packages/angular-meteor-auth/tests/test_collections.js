Meteor.users.allow({
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
