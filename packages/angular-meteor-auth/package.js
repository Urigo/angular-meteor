Package.describe({
  name: "angular-meteor-auth",
  summary: "Angular-Meteor authentication module",
  version: "0.0.2",
  git: "https://github.com/Urigo/angular-meteor.git",
  documentation: null
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.2.0.1');
  api.use('underscore@1.0.4');
  api.use('tracker@1.0.8');
  api.use('session@1.1.1');
  api.use('mongo@1.1.1');
  api.use('ejson@1.0.7');
  api.use('check@1.0.6');
  api.use('minimongo@1.0.9');
  api.use('observe-sequence@1.0.7');
  api.use('ecmascript');
  api.use('reactive-var');
  api.use('accounts-base');
  api.use('angular-meteor-data@0.0.9');

  api.use('angular:angular@1.4.7', 'client');

  api.use('diff-sequence');
  api.use('mongo-id');

  // Files to load in Client only.
  api.add_files([
    'angular-meteor-auth.js',
    'modules/auth.js'
  ], 'client');
});

Package.onTest(function(api) {
  api.use('underscore@1.0.4');
  api.use('tracker@1.0.8');
  api.use('session@1.1.1');
  api.use('mongo@1.1.1');
  api.use('insecure');
  api.use('sanjo:jasmine@0.19.0');
  api.use('angular:angular-mocks@1.4.7');
  api.use('angular-meteor-data');
  api.use('angular-meteor-auth');
  api.use('mizzao:accounts-testing');

  api.addFiles([
    'tests/integration/auth.spec.js',
    'tests/test_collections.js'
  ], 'client');
});
