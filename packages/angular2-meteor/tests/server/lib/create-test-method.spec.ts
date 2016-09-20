let collection = new Mongo.Collection('testCollectionServer');

Meteor.methods({
  'testMethod': function() {
    return 'TEST_VALUE';
  }
});

Meteor.publish('test', () => {
  return collection.find({});
});