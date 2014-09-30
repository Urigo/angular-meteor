angular.module('meteor-angular-docs',['ngMeteor', 'ui.router']);

Meteor.startup(function () {
  angular.bootstrap(document, ['meteor-angular-docs']);
});