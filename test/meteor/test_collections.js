Test4 = new Meteor.Collection('test4');
Test4.allow({
    insert: function() {
        return true;
    }
});
