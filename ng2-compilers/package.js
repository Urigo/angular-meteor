Package.describe({
  name: 'barbatus:ng2-compilers',
  version: '0.2.0-beta.0',
  summary: 'Angular2 template, HTML, JSX, TypeScript Compilers for Meteor',
  git: 'https://github.com/barbatus/ng2-compilers',
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
    'check@1.0.5',
    'underscore@1.0.4'
  ]
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.1');

  // Required in order to register plugins
  api.use('isobuild:compiler-plugin@1.0.0');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('barbatus:ng2-compilers');
});
