Package.describe({
  name: 'ardatan:angular-aot-compiler',
  version: '0.1.3',
  summary: 'Angular Compiler Package for AOT',
  git: 'https://github.com/ardatan/angular-meteor/atmosphere-packages/angular-aot-compiler',
  documentation: 'README.md'
});

Npm.depends({
  'meteor-typescript': '0.8.10',
  'typescript': '2.5.3',
  '@angular/compiler-cli': '5.0.0-rc.3',
  '@angular/compiler': '5.0.0-rc.3',
  '@angular/core': '5.0.0-rc.3',
  '@angular/common': '5.0.0-rc.3',
  'rxjs': '5.5.0',
  'rollup': '0.49.2',
  'rollup-plugin-node-resolve': '3.0.0',
  'rollup-plugin-hypothetical': '1.2.1',
  'rollup-plugin-commonjs': '8.2.0',
  'cheerio': '0.20.0',
  'node-sass': '4.5.3',
  'reflect-metadata': '0.1.10'
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
    'AngularAotCompiler'
  ], 'server');
});
