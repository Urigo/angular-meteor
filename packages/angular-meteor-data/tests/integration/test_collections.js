bigCollection = new Meteor.Collection('bigCollection');
bigCollection.allow({
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
