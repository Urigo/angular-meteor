Package.describe({
  name: 'angular-compilers',
  version: '1.0.0',
  summary: 'Angular Templates, HTML and TypeScript compilers for Meteor',
  git: 'https://github.com/Urigo/angular2-meteor/',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: 'Angular Compilers',
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
});
