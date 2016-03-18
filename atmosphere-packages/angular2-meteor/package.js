Package.describe({
  name: 'urigo:angular2-meteor',
  summary: 'Everything you need to use AngularJS 2.0 in your Meteor app',
  version: '0.4.5_1',
  git: 'https://github.com/Urigo/angular-meteor.git',
  documentation: '../../README.md'
});

Npm.depends({
  'angular2-meteor': 'https://github.com/Urigo/angular2-meteor/tarball/0c07434635eedd347854ec05ab3fc20ecfe732a0',
  'angular2-meteor-auto-bootstrap': 'https://github.com/Urigo/angular2-meteor-auto-bootstrap/tarball/e09ba84d36ecf31c289fe2b71d32d181bd8bde57'
});

Package.registerBuildPlugin({
  name: 'Compilers',
  sources: [
    'plugin/registrator.js'
  ],
  use: [
    'ecmascript@0.1.4',
    'angular2-html-templates@0.5.0'
  ]
});

Package.onUse(function (api) {
  api.versionsFrom('1.2.1');

  api.use([
    'isobuild:compiler-plugin@1.0.0',
    'barbatus:angular2@0.9.0'
  ]);

  // Some of the packages are used by Angular2-Meteor NPM.
  api.imply([
    'check@1.1.0',
    'tracker@1.0.9',
    'underscore@1.0.4',
    'ejson',
    'barbatus:angular2'
  ]);

  api.addFiles([
    'system_config.js'
  ]);

  api.addFiles(['app.html'], 'client');

  api.addFiles([
    '.npm/package/node_modules/angular2-meteor/modules/cursor_handle.ts',
    '.npm/package/node_modules/angular2-meteor/modules/mongo_cursor_observer.ts',
    '.npm/package/node_modules/angular2-meteor/modules/mongo_cursor_differ.ts',
    '.npm/package/node_modules/angular2-meteor/modules/meteor_component.ts',
    '.npm/package/node_modules/angular2-meteor-auto-bootstrap/modules/bootstrap.ts',
    'main.ts'
  ], 'client');

  // Add typings.
  api.addFiles([
    'typings/angular2-meteor.d.ts'
  ], 'server');
});