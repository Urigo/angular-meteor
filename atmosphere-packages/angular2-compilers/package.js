Package.describe({
  name: 'angular2-compilers',
  version: '1.0.0',
  summary: 'Angular 2 Templates, HTML and TypeScript compilers for Meteor',
  git: 'https://github.com/Urigo/angular2-meteor/',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: 'Angular2 Compilers',
  sources: [
    'plugin/register.js'
  ],
  use: [
    // Uses an external packages to get the actual compilers
    'ecmascript',
    'ardatan:angular-aot-compiler',
    'ardatan:angular-jit-compiler'
  ]
});

Package.onUse(function(api) {
  api.versionsFrom('1.5.2.2');

  // Required in order to register plugins
  api.use('isobuild:compiler-plugin');
  api.use('barbatus:typescript-runtime');
});
