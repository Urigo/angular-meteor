Package.describe({
  name: 'angular2-meteor-tests-package',
  version: '0.0.1',
  summary: '',
  git: 'https://github.com/Urigo/Meteor-Angular2',
  documentation: ''
});

Package.onUse(function(api) {
  api.versionsFrom('1.3-beta.10');
});

Package.onTest(function(api) {
  api.use([
    'tinytest',
    'sanjo:jasmine@0.18.0',
    'mongo@1.1.1',
    'underscore@1.0.4',
    'check',
    'tracker',
    'angular2-compilers@0.5.1',
    'ecmascript@0.4.0-beta.10'
  ]);

  api.addFiles([
    //'tests/client/unit/lib/imports.ts',
    'tests/client/unit/lib/fakes.ts',
    'tests/client/unit/meteor_component_spec.ts',
    'tests/client/unit/mongo_cursor_differ_spec.ts',
    'tests/client/unit/mongo_cursor_observer_spec.ts'
  ], 'client');
});
