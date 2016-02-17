Package.describe({
  name: "angular",
  summary: "Everything you need to use AngularJS in your Meteor app",
  version: "1.3.6",
  git: "https://github.com/Urigo/angular-meteor.git",
  documentation: "../../README.md"
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.2.0.1');

  api.imply([
    'angular-meteor-data@0.2.0',
    'angular-templates@0.0.3',
    'pbastowski:angular-babel@1.0.9'
  ]);
});
