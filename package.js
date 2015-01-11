Package.describe({
  summary: "The simplest no-conflict way to use AngularJS with Meteor, Meteorite and Atmosphere Smart Packages.",
  version: "0.6.0",
  git: "https://github.com/Urigo/angular-meteor.git"
});

Package.registerBuildPlugin({
  name: "compileAngularTemplates",
  sources: [
    "plugin/handler.js",
  ]
});

Package.on_use(function (api) {
  api.versionsFrom('METEOR@0.9.0.1');

  api.use('jquery', 'client', {weak: true});

  // Including bower
  api.use('mquandalle:bower@0.1.11', 'client');
  api.add_files('smart.json', 'client');

  // Files to load in Client only.
  api.add_files([
    // Lib Files
    'lib/angular-hash-key-copier.js',
    // Module Files
    'modules/angular-meteor-subscribe.js',
    'modules/angular-meteor-collections.js',
    'modules/angular-meteor-meteorCollection.js',
    'modules/angular-meteor-object.js',
    'modules/angular-meteor-template.js',
    'modules/angular-meteor-user.js',
    'modules/angular-meteor-methods.js',
    'modules/angular-meteor-session.js',
    'modules/angular-meteor-reactive-scope.js',
    'modules/angular-meteor-utils.js',
    // Finally load angular-meteor File
    'urigo:angular.js'
  ], 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use(['test-helpers'], ['client']);
  api.addFiles([
    'node_modules/angular/angular.js',
    'urigo:angular.js',
    'lib/angular-hash-key-copier.js',
    'modules/angular-meteor-collections.js',
    'modules/angular-meteor-meteorCollection.js',
    'modules/angular-meteor-methods.js',
    'modules/angular-meteor-object.js',
    'modules/angular-meteor-reactive-scope.js',
    'modules/angular-meteor-session.js',
    'modules/angular-meteor-subscribe.js',
    'modules/angular-meteor-template.js',
    'modules/angular-meteor-user.js',
    'modules/angular-meteor-utils.js',
    'test/urigo:angular-tests.js'
  ], ['client']);
});
