Package.describe({
  name: 'angular2-meteor',
  summary: 'Everything you need to use AngularJS 2.0 in your Meteor app',
  version: '0.5.0-beta.1',
  git: 'https://github.com/Urigo/angular-meteor.git'
});

Npm.depends({
  'angular2-meteor': 'https://github.com/Urigo/angular2-meteor/tarball/4db9e2e03bd03307dd901e1ff4058472e6651c22'
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
    'barbatus:angular2'
  ]);

  api.addFiles([
    '.npm/package/node_modules/angular2-meteor/modules/cursor_handle.ts',
    '.npm/package/node_modules/angular2-meteor/modules/mongo_cursor_observer.ts',
    '.npm/package/node_modules/angular2-meteor/modules/mongo_cursor_differ.ts',
    '.npm/package/node_modules/angular2-meteor/modules/meteor_component.ts'
  ], 'client');
});