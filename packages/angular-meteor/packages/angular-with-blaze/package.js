Package.describe({
  name: "angular-with-blaze",
  summary: "Everything you need to use both AngularJS and Blaze templates in your Meteor app",
  version: "1.3.11",
  git: "https://github.com/Urigo/angular-meteor.git",
  documentation: "../../README.md"
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.2.0.1');
  api.use('blaze-html-templates', 'client');

  api.imply([
    'blaze-html-templates',
    'angular-meteor-data@1.3.11',
    'angular-blaze-templates-compiler@0.0.1'
  ]);
});
