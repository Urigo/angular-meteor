Meteor.startup(function() {
  if (SampleData.find({}).count() === 0) {
    for (var i = 0; i < 200; i++) {
      SampleData.insert(SampleItem);
    }
  }
});

Meteor.methods({
  'addItems' : function (numOfItems) {
    for (var i = 0; i < numOfItems; i++) {
      SampleData.insert(SampleItem);
    }
  },
  'removeItem' : function(id) {
    SampleData.remove({ _id : id });
  },
  'removeItems' : function(numOfItems) {
    for (var i = 0; i < numOfItems; i++) {
      SampleData.remove(SampleData.findOne({})._id);
    }
  }
});

Meteor.publish('data', function() {
  return SampleData.find({});
});
