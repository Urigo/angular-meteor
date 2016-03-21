Package.describe({
  name: 'barbatus:angular2-runtime',
  version: '0.2.1',
  summary: 'Angular2 Dependencies and Polyfills Packaged for Meteor',
  git: 'https://github.com/Urigo/angular2-meteor/tree/master/atmosphere-packages',
  documentation: null
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.1');

  api.use([
    'underscore',
    // This is important, i.e., adding it here
    // (before Angular2 itself) makes Angular2
    // to patch Meteor promise properly.
    'promise@0.4.8'
  ]);

  api.imply([
    // Add Map, Set ES6 polyfills.
    'babel-runtime',
    'promise'
  ]);

  api.addFiles([
    // Add auxiliary ES6 for Angular2.
    'dist/angular2_deps.js',
    'node_modules/angular2/bundles/angular2-polyfills.js'
  ], 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('barbatus:angular2-runtime');
});
