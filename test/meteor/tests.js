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
