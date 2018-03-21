Package.describe({
  name: 'angular-scss-compiler',
  version: '0.3.1_1',
  summary: 'Angular Scss Compiler Package',
  git: 'https://github.com/Urigo/angular-meteor/tree/master/atmosphere-packages/angular-scss-compiler',
  documentation: null
});

Npm.depends({
  'node-sass': '4.7.2'
});

Package.onUse(function(api) {
  api.versionsFrom('1.6');
  api.use([
    'ecmascript'
  ], 'server');
  api.mainModule('index.js', 'server');
});
