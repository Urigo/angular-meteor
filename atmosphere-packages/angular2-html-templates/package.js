Package.describe({
  name: 'angular2-html-templates',
  version: '0.5.4',
  summary: 'Angular 2 HTML templates compiler for Meteor',
  git: 'https://github.com/Urigo/angular2-meteor/tree/master/atmosphere-packages/angular2-html-templates',
  documentation: 'README.md'
});

Npm.depends({
  'cheerio': '0.19.0'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3');

  api.use([
    'caching-compiler@1.0.0',
    'ecmascript@0.4.3',
    'underscore@1.0.8',
    'check@1.2.1',
    'babel-compiler@6.6.4'
  ]);

  api.addFiles([
    'utils/file_mixin.js',
    'compilers/ng_compiler.js',
    'compilers/ng_caching_compiler.js',
    'compilers/html_compiler.js'
  ], 'server');

  api.export(['HtmlCompiler'], 'server');
});

Package.onTest(function(api) {
  api.use('tinytest');
});
