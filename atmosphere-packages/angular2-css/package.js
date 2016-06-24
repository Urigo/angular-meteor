Package.describe({
  name: 'barbatus:angular2-css',
  version: '0.1.1',
  summary: 'Angular 2 CSS compiler for Meteor',
  git: 'https://github.com/Urigo/angular2-meteor/tree/master/atmosphere-packages/angular2-css',
  documentation: 'README.md'
});

Npm.depends({
  'less': 'https://github.com/meteor/less.js/tarball/8130849eb3d7f0ecf0ca8d0af7c4207b0442e3f6'
});

Package.registerBuildPlugin({
  name: 'Angular2 CSS Compiler',
  sources: [
    'plugin/register.js',
    'compilers/basic_compiler.js',
    'compilers/css_compiler.js',
    'compilers/less_compiler.js',
    'compilers/style_compiler.js'
  ],
  use: [
    'ecmascript@0.4.3',
    'caching-compiler@1.0.0',
    'underscore@1.0.8',
    'check@1.2.1',
    'babel-compiler@6.6.4'
  ],
  npmDependencies: {
    'less': 'https://github.com/meteor/less.js/tarball/8130849eb3d7f0ecf0ca8d0af7c4207b0442e3f6'
  }
});

Package.onUse(function(api) {
  api.versionsFrom('1.3');

  // Required in order to register plugins
  api.use('isobuild:compiler-plugin@1.0.0');
});

Package.onTest(function(api) {
  api.use('tinytest');
});
