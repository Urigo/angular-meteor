Package.describe({
  name: "angular",
  summary: "Everything you need to use AngularJS in your Meteor app",
  version: "1.2.3",
  git: "https://github.com/Urigo/angular-meteor.git",
  documentation: "../../README.md"
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.2.0.1');

  api.imply([
    'angular-meteor-data@0.0.6',
    'angular-templates@0.0.2',
    'pbastowski:angular-babel@1.0.6'
  ])
});
