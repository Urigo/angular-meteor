Package.describe({
  name: 'barbatus:angular2-runtime',
  version: '0.2.3_2',
  summary: 'Angular2 Dependencies and Polyfills Packaged for Meteor',
  git: 'https://github.com/Urigo/angular2-meteor/tree/master/atmosphere-packages',
  documentation: null
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.1');

  api.use([
    'underscore',
    'ecmascript'
  ]);

  api.imply([
    // Add Map, Set ES6 polyfills.
    'babel-runtime',
    // This is important, i.e., adding it along
    // with Angular2 polyfills to patch
    // Meteor promise properly.
    'promise'
  ]);

  api.addFiles([
    // Add auxiliary ES6 for Angular2.
    'dist/angular2_deps.js',
    'dist/angular2-polyfills.js'
  ], 'client');

  api.addFiles(['server_deps.js'], 'server');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('barbatus:angular2-runtime');
});
