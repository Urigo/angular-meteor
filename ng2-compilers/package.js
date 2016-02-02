Package.describe({
  name: 'barbatus:ng2-compilers',
  version: '0.2.0-beta.2',
  summary: 'Angular2 template, HTML, TypeScript Compilers for Meteor 1.3',
  git: 'https://github.com/Urigo/angular2-meteor/',
  documentation: null
});

Package.registerBuildPlugin({
  name: 'Compilers',
  sources: [
    'utils/file_mixin.js',
    'utils/mixin.js',
    'compilers/ng_compiler.js',
    'compilers/ng_caching_compiler.js',
    'compilers/html_compiler.js',
    'plugin/register.js'
  ],
  use: [
    'caching-compiler@1.0.0',
    'mrt:cheerio@0.3.2',
    'barbatus:ts-compilers@0.2.5',
    'ecmascript@0.3.1-modules.4',
    'check@1.1.0',
    'underscore@1.0.4'
  ]
});

Package.onUse(function(api) {
  api.versionsFrom('1.3-modules-beta.4');

  // Required in order to register plugins
  api.use('isobuild:compiler-plugin@1.0.0');

  api.imply([
    'check@1.1.0',
    'ejson@1.0.7',
    'mongo@1.1.3',
    'tracker@1.0.9',
    'underscore@1.0.4'
  ]);

  api.addFiles('stub/stub.html');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('barbatus:ng2-compilers');
});
