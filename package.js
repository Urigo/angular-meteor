Package.describe({
  name: 'urigo:angular2-meteor',
  version: '0.1.0',
  summary: 'Angular2 and Meteor integration',
  git: 'https://github.com/Urigo/Meteor-Angular2',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use([
    'check@1.0.5',
    'universe:modules@0.4.1'
  ]);

  api.imply([
    'barbatus:angular2@0.1.0'
  ]);

  api.addFiles([
    'system-config.js',
    'main.import.js',
    'modules/mongo_collection_observer.import.js',
    'modules/mongo_collection_differ.import.js'
  ]);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('sanjo:jasmine@0.18.0');
  api.use('urigo:angular2-meteor');

  api.addFiles([
    'tests/client/unit/mongo_collection_differ_spec.js',
    'tests/client/unit/mongo_collection_observer_spec.js'
  ], 'client');
});
