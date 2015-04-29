/*
 * Execute these tests by going to the main directory and running:
 * meteor test-packages ./
 */

Tinytest.add('Bootstrap Angular.js ', function (test) {

  var called = false;

  Router = {
    onAfterAction: function(action) {
      called = true;
      action();
    }
  };

  var app = angular.module('app', ['angular-meteor']);
  angular.bootstrap(document.createElement('div'), ['app']);
  test.equal(called, true, 'it should call Router.onAfterAction()');

});

Tinytest.addAsync('Diff changes to array', function (test, done) {

  var diffArrayTest = angular.module('diffArrayTest', ['diffArray'])
  .run(['diffArray', function (diffArray) {

    var addedDoc = {_id: "c", b: 1};
    var oldCollection = [
      {_id: "a", identical: "property"},
      {_id: "b", first: 2, second: {firstNested: "b"}, willBeRemoved: ":'("}
    ];
    var newCollection = [
      {_id: "a", identical: "property"},
      {_id: "b", first: 2, second: {nestedInSecond: "a"}, third: "hello"},
      addedDoc
    ];

    diffArray(oldCollection, newCollection, {
      addedAt: function (id, doc, pos) {
        test.equal(doc, addedDoc);
        test.equal(pos, 2);
      },
      changedAt: function (id, setDiff, unsetDiff, pos) {
        test.equal(setDiff, {_id: "b", "second.nestedInSecond": "a", "third": "hello"});
        test.equal(unsetDiff, {_id: "b", "second.firstNested": true, willBeRemoved: true});
        test.equal(pos, 1);
        done();
      }
    });
  }]);

  angular.bootstrap(document.createElement('div'), ['diffArrayTest']);

});

Tinytest.add('$meteorCollection initialization', function (test) {

  if (Meteor.isServer) {
    Meteor.startup(function() {
      return Meteor.methods({
        removeAllParties: function() {
          Parties.remove({});
        }
      });
    });
  }
  if (Mongo.Collection.get('parties') == undefined)
    Parties = new Mongo.Collection('parties');

  Meteor.call('removeAllParties');

  var parties = [
    {'name': 'Dubstep-Free Zone',
      'description': 'Fast just got faster with Nexus S.'},
    {'name': 'All dubstep all the time',
      'description': 'Get it on!'},
    {'name': 'Savage lounging',
      'description': 'Leisure suit required. And only fiercest manners.'}
  ];

  for (var i = 0; i < parties.length; i++)
    Parties.insert({name: parties[i].name, description: parties[i].description});

  if (Meteor.isClient) {

    var app = angular.module('app', ['angular-meteor']);

    app.run(['$rootScope', '$meteorCollection',
      function($rootScope, $meteorCollection){

        $rootScope.parties = $meteorCollection(Parties);

        var partiesWithoutIds = _.map($rootScope.parties, function(o) { return _.omit(o, '_id'); });
        test.equal(
          partiesWithoutIds,
          parties,
          'it should be equal to the Parties collection');

        _.each($rootScope.parties, function(currentParty){
          test.isTrue(_.has(currentParty, '_id'), 'has an _id field');
        });

      }]);

    angular.bootstrap(document.createElement('div'), ['app']);
  }

});

function addRandomDocs(scope, clientId, number, timeBasis) {
    for (var i = 0; i < number; i++) {
       var rand = (Math.random() * timeBasis) << 0;
       setTimeout(_.partial(function(index, timeout) {
        scope.test4.push({
            name: clientId + index,
            number: timeout
        });
        scope.$apply();
       }, i, rand), rand);
    };
}

Tinytest.addAsync('$meteorCollection updates from server and client concurrent saving',
  function (test, done) {
    var app = angular.module('app', ['angular-meteor']);

    app.run(['$rootScope', '$meteor', '$timeout', 
      function($rootScope, $meteor, $timeout) {

        // Makes test cleanup.
        Meteor.call('test4__cleanup', function() {
          $rootScope.limit = 100;
          // Defines Meteor collection.
          $rootScope.test4 = $meteor.collection(function() {
            return Test4.find({}, {
                  limit: $rootScope.getReactively('limit')
              });
          });

          // Gets first docs. 
          Meteor.subscribe('test4', {limit: $rootScope.limit}, function() {

            $timeout(function() {
              // Verifies that docs received.
              test.isTrue($rootScope.test4.length == $rootScope.limit);

              // Here is we try to hit interval when collection is being updated from server
              // while inserting new 100 docs on the client.
              addRandomDocs($rootScope, 'client_before', 100, 100);
              Meteor.subscribe('test4', {
                  limit: $rootScope.limit + 100
              }, function() {
                  $rootScope.limit += 100;
                  $rootScope.$apply();
                  // Inserts another one 100 docs at random intervals.
                  addRandomDocs($rootScope, 'client_after', 100, 50);

                  $timeout(function() {
                    // Verifies that collection contains valid number of docs i.e.
                    // inserting on the client doesn't affect subscribe's limits. 
                    test.isTrue($rootScope.test4.length == $rootScope.limit);

                    // Verifies that all docs from the client have been saved
                    Meteor.call('test4__addedByClient', 'client', function(error, fromClient) {
                      test.isTrue(fromClient.length == 200);
                      done();
                    });
                  }, 120, false);
              });
            }, 100, false);
            
          });
        });

      }]);

    angular.bootstrap(document.createElement('div'), ['app']);
  });
