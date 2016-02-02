Package.describe({
  name: 'angular2-templates-compiler',
  version: '0.5.0-beta.1',
  summary: 'Angular 2 HTML templates compiler for Meteor',
  git: 'https://github.com/Urigo/angular2-meteor/',
  documentation: 'README.md'
});

Npm.depends({
  'cheerio': '0.19.0'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3-modules-beta.5');

  api.use('caching-compiler@1.0.0', 'server'); // Needed in order to extend the CachingCompiler
  api.use('ecmascript@0.3.1-modules.5', 'server'); // Needed in order to write ES6 code in compilers code
  api.use('check@1.0.5', 'server');
  api.use('underscore@1.0.5-modules.5', 'server');

  api.addFiles([
    'utils/file_mixin.js',
    'compilers/ng_compiler.js',
    'compilers/ng_caching_compiler.js',
    'compilers/html_compiler.js'
  ], 'server');

  api.export(['HtmlCompiler'], 'server'); // Export in order to provide other packages the ability to register the build plugin
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('angular2-templates-compiler');
});
