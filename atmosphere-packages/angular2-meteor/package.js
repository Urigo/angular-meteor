Package.describe({
  name: 'angular2-meteor',
  summary: 'Everything you need to use AngularJS 2.0 in your Meteor app',
  version: '0.5.0-beta.1',
  git: 'https://github.com/Urigo/angular-meteor.git'
});

Npm.depends({
  'angular2-meteor': 'https://github.com/Urigo/angular2-meteor/tarball/24fa5613977ca41b1091690d53d4324881e37db6',
  'angular2-meteor-auto-bootstrap': 'https://github.com/Urigo/angular2-meteor-auto-bootstrap/tarball/9e312370199e7e9de5be249209c2578a8a439730'
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
    '.npm/package/node_modules/angular2-meteor/node_modules/ejson/index.js',
    '.npm/package/node_modules/angular2-meteor-auto-bootstrap/modules/bootstrap.ts'
  ], 'client');
});