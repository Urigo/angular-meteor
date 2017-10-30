Package.describe({
  name: 'angular-typescript-compiler',
  version: '0.2.7_1',
  summary: 'Angular TypeScript Compiler Package',
  git: 'https://github.com/Urigo/angular-meteor/tree/master/atmosphere-packages/angular-typescript-compiler',
  documentation: null
});

Npm.depends({
  'meteor-typescript': '0.8.10',
  '@angular/core': '5.0.0-rc.8',
  '@angular/common': '5.0.0-rc.8',
  '@angular/compiler': '5.0.0-rc.8',
  '@angular/compiler-cli': '5.0.0-rc.8',
  'typescript': '2.5.3'
});

Package.onUse(function(api) {
  api.versionsFrom('1.5.2.2');
  api.use([
    'ecmascript',
    'babel-compiler',
    'angular-html-compiler@0.2.5',
    'angular-scss-compiler@0.2.5'
  ], 'server');
  api.mainModule('index.js', 'server');
});
