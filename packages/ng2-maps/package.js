Package.describe({
  name: 'barbatus:ng2-google-maps',
  version: '0.5.0',
  summary: 'Google Maps for Angular2',
  git: 'https://github.com/Urigo/angular2-meteor/tree/master/packages/ng2-google-maps',
  documentation: null
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.1');

  api.use([
    'barbatus:angular2@0.7.4_5'
  ]);

  api.addFiles([
    // Directives.
    'angular2-google-maps/src/directives/google-map-marker.ts',
    'angular2-google-maps/src/directives/google-map.ts',
    // Maps loaders.
    'angular2-google-maps/src/services/maps-api-loader/lazy-maps-api-loader.ts',
    'angular2-google-maps/src/services/maps-api-loader/maps-api-loader.ts',
    'angular2-google-maps/src/services/maps-api-loader/noop-maps-api-loader.ts',
    // Services.
    'angular2-google-maps/src/services/google-maps-api-wrapper.ts',
    'angular2-google-maps/src/services/google-maps-types.ts',
    'angular2-google-maps/src/services/marker-manager.ts',
    // Core.
    'angular2-google-maps/src/directives.ts',
    'angular2-google-maps/src/directives-const.ts',
    'angular2-google-maps/src/services.ts',
    'angular2-google-maps/src/core.ts'
  ], 'client');

  api.addFiles([
    'core.ts',
    'system_config.js'
  ], 'client');
});

Package.onTest(function(api) {
  api.use([
    'tinytest',
    'sanjo:jasmine@0.18.0',
    'barbatus:ng2-google-maps'
  ]);
});
