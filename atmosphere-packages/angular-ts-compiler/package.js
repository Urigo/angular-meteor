Package.describe({
  name: 'ardatan:angular-ts-compiler',
  version: '0.2.5',
  summary: 'Angular TypeScript Compiler Package',
  git: 'https://github.com/ardatan/angular-meteor',
  documentation: null
});

Npm.depends({
  'meteor-typescript': '0.8.10',
  '@angular/core': '5.0.0-rc.5',
  '@angular/common': '5.0.0-rc.5',
  '@angular/compiler': '5.0.0-rc.5',
  '@angular/compiler-cli': '5.0.0-rc.5',
  'typescript': '2.4.2'
});

Package.onUse(function(api) {
  api.versionsFrom('1.5.2.2');
  api.use([
    'ecmascript',
    'babel-compiler',
    'ardatan:angular-html-compiler@0.2.5',
    'ardatan:angular-scss-compiler@0.2.5'
  ], 'server');
  api.mainModule('index.js', 'server');
});
