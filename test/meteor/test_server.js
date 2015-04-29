Meteor.publish('test4', function(options) {
    return Test4.find({}, {
        limit: options.limit
    });
});

Meteor.methods({
    test4__addedByClient: function(prefix) {
        return Test4.find({name : {$regex : prefix + '.*'}}).fetch();
    },
    test4__cleanup: function() {
        Test4.remove({});
        console.log(Test4.find({}).count());
        for (var i = 0; i < 1000; i++) {
            var rand = (Math.random() * 1000) << 0;
            Test4.insert({
              name: 'foo ' + i,
              number: rand
            });
        }
    }
});
