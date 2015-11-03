Package.describe({
  name: "angular",
  summary: "Everything you need to use AngularJS in your Meteor app",
  version: "1.2.0-rc.2",
  git: "https://github.com/Urigo/angular-meteor.git"
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.2.0.1');

  api.imply([
    'angular-meteor-data',
    'angular-templates',
    'pbastowski:ng-babel'
  ])
});
