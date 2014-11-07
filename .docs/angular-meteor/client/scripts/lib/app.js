angular.module('meteor-angular-docs',['angular-meteor', 'ui.router']);

Meteor.startup(function () {
  angular.bootstrap(document, ['meteor-angular-docs']);
});