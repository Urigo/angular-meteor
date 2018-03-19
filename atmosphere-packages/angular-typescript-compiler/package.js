Package.describe({
  name: 'angular-typescript-compiler',
  version: '0.3.0',
  summary: 'Angular TypeScript Compiler Package',
  git: 'https://github.com/Urigo/angular-meteor/tree/master/atmosphere-packages/angular-typescript-compiler',
  documentation: null
});

Npm.depends({
  'meteor-typescript': '0.8.10',
  'rollup': '0.41.4',
  'rollup-plugin-node-resolve': '3.0.0',
  'rollup-plugin-hypothetical': '1.2.1',
  'rollup-plugin-commonjs': '8.2.0'
});

Package.onUse(function(api) {
  api.versionsFrom('1.6.1');
  api.use([
    'ecmascript',
    'babel-compiler@7.0.0',
    'angular-html-compiler@0.3.0',
    'angular-scss-compiler@0.3.0'
  ], 'server');
  api.mainModule('index.js', 'server');
});
