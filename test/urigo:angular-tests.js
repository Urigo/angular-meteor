

Tinytest.add('When bootstrapping Angular.js ', function (test) {

  var called = false;

  Router = {
    onAfterAction: function(action) {
      called = true;
      action();
    }
  };

  var app = angular.module('app', ['angular-meteor']);
  angular.bootstrap(document, ['app']);
  test.equal(called, true, 'it should call Router.onAfterAction()');

});
