Package.describe({
  name: 'angular-typescript-compiler',
  version: '0.2.8_1',
  summary: 'Angular TypeScript Compiler Package',
  git: 'https://github.com/Urigo/angular-meteor/tree/master/atmosphere-packages/angular-typescript-compiler',
  documentation: null
});

Npm.depends({
  'meteor-typescript': '0.8.10',
  '@angular/core': '5.0.2',
  '@angular/common': '5.0.2',
  '@angular/compiler': '5.0.2',
  '@angular/compiler-cli': '5.0.2',
  'typescript': '2.6.1'
});

Package.onUse(function(api) {
  api.versionsFrom('1.6');
  api.use([
    'ecmascript',
    'babel-compiler',
    'angular-html-compiler@0.2.8',
    'angular-scss-compiler@0.2.8'
  ], 'server');
  api.mainModule('index.js', 'server');
});
