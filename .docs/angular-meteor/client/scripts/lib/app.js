angular.module('meteor-angular-docs',[
  'angular-meteor',
  'ui.router',
  'btford.markdown']);

Meteor.startup(function () {
  angular.bootstrap(document, ['meteor-angular-docs']);
});