Package.describe({
  name: 'angular2-meteor',
  summary: 'Everything you need to use AngularJS 2.0 in your Meteor app',
  version: '0.5.0-beta.1',
  git: 'https://github.com/Urigo/angular-meteor.git'
});

Npm.depends({
  'angular2-meteor': 'https://github.com/Urigo/angular2-meteor/tarball/7e6785471aff38a241addd45183959f7037b03a7',
  'angular2-meteor-auto-bootstrap': 'https://github.com/Urigo/angular2-meteor-auto-bootstrap/tarball/e09ba84d36ecf31c289fe2b71d32d181bd8bde57'
});

Package.onUse(function (api) {
  api.versionsFrom('1.2.1');

  api.use([
    'systemjs:systemjs',
    'barbatus:angular2',
    'babel-runtime'
  ]);

  api.imply([
    'babel-runtime',
    'systemjs:systemjs',
    'angular2-compilers'
  ]);

  api.addFiles([
    'system_config.js'
  ]);

  api.addFiles([
    '.npm/package/node_modules/angular2-meteor/modules/cursor_handle.ts',
    '.npm/package/node_modules/angular2-meteor/modules/mongo_cursor_observer.ts',
    '.npm/package/node_modules/angular2-meteor/modules/mongo_cursor_differ.ts',
    '.npm/package/node_modules/angular2-meteor/modules/meteor_component.ts',
    '.npm/package/node_modules/angular2-meteor-auto-bootstrap/modules/bootstrap.ts'
  ], 'client');
});