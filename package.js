Package.describe({
  name: 'urigo:angular2-meteor',
  version: '0.2.0',
  summary: 'Angular2 and Meteor integration',
  git: 'https://github.com/Urigo/Meteor-Angular2',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: 'TSTypings',
  sources: [
    'plugin/typings_init.js'
  ],
  npmDependencies: {
    'mkdirp': '0.5.0'
  }
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.1');

  api.use([
    'check@1.0.5',
    'mongo@1.1.1',
    'tracker@1.0.8',
    'underscore@1.0.4',
    'barbatus:angular2@0.5.3_6'
  ]);

  api.imply([
    'barbatus:angular2@0.5.3_6'
  ]);

  api.addFiles([
    'system_config.js'
  ]);

  api.addFiles([
    'main.jsx',
    'modules/meteor_component.jsx',
    'modules/cursor_handle.jsx',
    'modules/mongo_cursor_observer.jsx',
    'modules/mongo_cursor_differ.jsx',
    'modules/bootstrap.jsx'
  ], 'client');

  // Adds TS typings.
  api.addFiles([
    'typings/angular2-meteor.d.ts'
  ], 'server');
});

Package.onTest(function(api) {
  api.use([
    'tinytest',
    'sanjo:jasmine@0.18.0',
    'mongo@1.1.1',
    'underscore@1.0.4',
    'urigo:angular2-meteor'
  ]);

  api.addFiles([
    'tests/client/unit/lib/fakes.js',
    'tests/client/unit/meteor_component_spec.js',
    'tests/client/unit/mongo_cursor_differ_spec.js',
    'tests/client/unit/mongo_cursor_observer_spec.js'
  ], 'client');
});
