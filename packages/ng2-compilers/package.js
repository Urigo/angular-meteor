Package.describe({
  name: 'barbatus:ng2-compilers',
  version: '0.1.1',
  summary: 'Angular2 Compilers for Meteor',
  git: 'https://github.com/barbatus/ng2-compilers',
  documentation: null
});

Npm.depends({
  'cheerio': '0.19.0'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.1');

  api.use([
    'caching-compiler@1.0.0',
    'ecmascript@0.1.4',
    'check@1.0.5',
    'underscore@1.0.4'
  ], 'server');

  api.addFiles([
    'utils/mixin.js',
    'utils/file_mixin.js',
    'compilers/ng_compiler.js',
    'compilers/ng_caching_compiler.js',
    'compilers/jsx_compiler.js',
    'compilers/html_compiler.js'
  ], 'server');

  api.export([
    'JsxCompiler',
    'HtmlCompiler'
  ], 'server');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('barbatus:ng2-compilers');
});
