Package.describe({
  name: 'angular2-meteor-tests-package',
  version: '0.0.1',
  summary: '',
  git: 'https://github.com/Urigo/Meteor-Angular2',
  documentation: ''
});

Package.onUse(function(api) {
  api.versionsFrom('1.3-modules-beta.5');
});

Package.onTest(function(api) {
  api.use([
    'tinytest',
    'sanjo:jasmine@0.18.0',
    'mongo@1.1.1',
    'underscore@1.0.4',
    'check',
    'tracker',
    'ecmascript@0.3.1-modules.5'
  ]);

  api.addFiles([
    'tests/client/unit/lib/imports.js',
    'tests/client/unit/lib/fakes.js',
    'tests/client/unit/meteor_component_spec.js',
    'tests/client/unit/mongo_cursor_differ_spec.js',
    'tests/client/unit/mongo_cursor_observer_spec.js'
  ], 'client');
});