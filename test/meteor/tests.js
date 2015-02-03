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
