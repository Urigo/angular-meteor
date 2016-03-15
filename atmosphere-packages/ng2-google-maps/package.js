Package.describe({
  name: 'barbatus:ng2-google-maps',
  version: '0.6.2_3',
  summary: 'Google Maps for Angular2',
  git: 'https://github.com/Urigo/angular2-meteor/tree/master/packages/ng2-google-maps',
  documentation: null
});

Npm.depends({
  'angular2-google-maps': 'https://github.com/SebastianM/angular2-google-maps/tarball/e4ca50b05a052b6a824dcb6e68b0a80539b47452'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.1');

  api.use([
    'barbatus:angular2@0.9.0'
  ]);

  // Installs typings.
  api.addFiles([
    'typings/ng2-google-maps/ng2-google-maps.d.ts'
  ], 'server');

  api.addFiles([
    // Directives.
    '.npm/package/node_modules/angular2-google-maps/src/directives/google-map-marker.ts',
    '.npm/package/node_modules/angular2-google-maps/src/directives/google-map.ts',
    // Maps loaders.
    '.npm/package/node_modules/angular2-google-maps/src/services/maps-api-loader/lazy-maps-api-loader.ts',
    '.npm/package/node_modules/angular2-google-maps/src/services/maps-api-loader/maps-api-loader.ts',
    '.npm/package/node_modules/angular2-google-maps/src/services/maps-api-loader/noop-maps-api-loader.ts',
    // Services.
    '.npm/package/node_modules/angular2-google-maps/src/services/google-maps-api-wrapper.ts',
    '.npm/package/node_modules/angular2-google-maps/src/services/google-maps-types.ts',
    '.npm/package/node_modules/angular2-google-maps/src/services/marker-manager.ts',
    // Core.
    '.npm/package/node_modules/angular2-google-maps/src/directives.ts',
    '.npm/package/node_modules/angular2-google-maps/src/directives-const.ts',
    '.npm/package/node_modules/angular2-google-maps/src/services.ts',
    '.npm/package/node_modules/angular2-google-maps/src/events.ts',
    '.npm/package/node_modules/angular2-google-maps/src/core.ts'
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
