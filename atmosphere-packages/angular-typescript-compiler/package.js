Package.describe({
  name: 'angular-typescript-compiler',
  version: '0.2.9_5',
  summary: 'Angular TypeScript Compiler Package',
  git: 'https://github.com/Urigo/angular-meteor/tree/master/atmosphere-packages/angular-typescript-compiler',
  documentation: null
});

Npm.depends({
  'meteor-typescript': '0.8.10',
  'rollup': '0.52.1',
  'rollup-plugin-node-resolve': '3.0.0',
  'rollup-plugin-hypothetical': '2.0.0',
  'rollup-plugin-commonjs': '8.2.6'
});

Package.onUse(function(api) {
  api.versionsFrom('1.6');
  api.use([
    'ecmascript',
    'babel-compiler',
    'angular-html-compiler@0.2.9',
    'angular-scss-compiler@0.2.9',
    'underscore@1.0.10',
    'tmeasday:check-npm-versions@0.3.1'
  ], 'server');
  api.mainModule('index.js', 'server');
});
