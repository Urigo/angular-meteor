Package.describe({
  name: 'ardatan:angular-jit-compiler',
  version: '0.1.7',
  summary: 'Angular Compiler Package for JIT',
  git: 'https://github.com/ardatan/angular-meteor',
  documentation: 'README.md'
});

Npm.depends({
  'cheerio': '0.22.0',
  'node-sass': '4.5.3'
});

Package.onUse(function(api) {
  api.versionsFrom('1.5.2.2');
  api.use([
    'ecmascript',
    'barbatus:typescript-compiler@0.9.12',
    'babel-compiler'
  ], 'server');
  api.mainModule('index.js', 'server');
  api.export([
    'AngularJitTsCompiler',
    'AngularJitHtmlCompiler',
    'AngularJitCssCompiler',
    'AngularJitScssCompiler'
  ], 'server');
});
