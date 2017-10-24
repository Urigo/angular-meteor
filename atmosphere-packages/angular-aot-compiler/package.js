Package.describe({
  name: 'ardatan:angular-aot-compiler',
  version: '0.1.6',
  summary: 'Angular Compiler Package for AOT',
  git: 'https://github.com/ardatan/angular-meteor',
  documentation: 'README.md'
});

Npm.depends({
  'meteor-typescript': '0.8.10',
  'rollup': '0.50.0',
  'rollup-plugin-node-resolve': '3.0.0',
  'rollup-plugin-hypothetical': '2.0.0',
  'rollup-plugin-commonjs': '8.2.4',
  'cheerio': '0.22.0',
  'node-sass': '4.5.3',
  'reflect-metadata': '0.1.10'
});

Package.onUse(function(api) {
  api.versionsFrom('1.5.2.2');
  api.use([
    'underscore',
    'tmeasday:check-npm-versions@0.3.1',
    'ecmascript',
    'barbatus:typescript-compiler@0.9.12',
    'babel-compiler'
  ], 'server');
  api.mainModule('index.js', 'server');
  api.export([
    'AngularAotCompiler'
  ], 'server');
});
