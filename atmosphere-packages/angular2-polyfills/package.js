Package.describe({
  name: 'barbatus:angular2-polyfills',
  version: '0.5.1',
  summary: 'Polyfills for Angular2',
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
    'babel-runtime@1.0.1'
  ]);

  api.addFiles(['client_deps.js'], 'client', {
    lazy: false
  });
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('barbatus:angular2-runtime');
});
