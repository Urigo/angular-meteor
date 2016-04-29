Package.describe({
  name: 'angular-templates-runtime',
  summary: 'Compile angular templates into the template cache',
  version: '0.0.1',
  git: 'https://github.com/Urigo/angular-meteor.git',
  documentation: null
});

Npm.depends({
  'html-minifier' : '0.6.9'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.2.0.1');

  api.use([
    'ecmascript@0.1.6',
    'underscore@1.0.4',
    'html-tools@1.0.5',
    'templating-tools@1.0.0'
  ], 'server');

  api.imply([
    'caching-html-compiler@1.0.2',
    'templating-tools@1.0.0',
    'ecmascript@0.1.6'
  ], 'server');

  api.addFiles([
    'ng-html-scanner.js',
    'ng-template-compiler.js',
    'index.js'
  ], 'server');

  api.export([
    'AngularTemplates'
  ], 'server');
});
