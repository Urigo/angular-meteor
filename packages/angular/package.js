Package.describe({
  name: "angular",
  summary: "Everything you need to use AngularJS in your Meteor app",
  version: "1.3.7-beta.1_1",
  git: "https://github.com/Urigo/angular-meteor.git",
  documentation: "../../README.md"
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.2.0.1');

  api.imply([
    'angular-meteor-data@0.3.0-beta.1',
    'angular-templates@1.0.0',
    'pbastowski:angular-babel@1.0.9'
  ]);
});
