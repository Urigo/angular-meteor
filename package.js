Package.describe({
  name: 'urigo:angular2-meteor',
  version: '0.1.1',
  summary: 'Angular2 and Meteor integration',
  git: 'https://github.com/Urigo/Meteor-Angular2',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use([
    'check@1.0.5',
    'barbatus:angular2@0.3.2'
  ]);

  api.imply([
    'barbatus:angular2@0.3.2'
  ]);

  api.addFiles([
    'system_config.js',
    'main.jsx',
    'modules/meteor_component.jsx',
    'modules/cursor_handle.jsx',
    'modules/mongo_cursor_observer.jsx',
    'modules/mongo_cursor_differ.jsx',
    'modules/bootstrap.jsx'
  ]);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('sanjo:jasmine@0.18.0');
  api.use('urigo:angular2-meteor');

  api.addFiles([
    'tests/client/unit/lib/fakes.js',
    'tests/client/unit/mongo_cursor_differ_spec.js',
    'tests/client/unit/mongo_cursor_observer_spec.js'
  ], 'client');
});
