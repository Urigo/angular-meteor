Package.describe({
  name: 'angular-scss-compiler',
  version: '0.4.0',
  summary: 'Angular Scss Compiler Package',
  git: 'https://github.com/Urigo/angular-meteor/tree/master/atmosphere-packages/angular-scss-compiler',
  documentation: null
});

Npm.depends({
  'node-sass': '5.0.0'
});

Package.onUse(function (api) {
  api.versionsFrom("1.11");
  api.use([
    'ecmascript'
  ], 'server');
  api.mainModule('index.js', 'server');
});
