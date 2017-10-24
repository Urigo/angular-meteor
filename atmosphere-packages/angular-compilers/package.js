Package.describe({
  name: 'ardatan:angular-compilers',
  version: '0.1.5',
  summary: 'Angular Templates, HTML and TypeScript compilers for Meteor',
  git: 'https://github.com/ardatan/angular-meteor',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: 'Angular Compilers',
  sources: [
    'plugin/register.js'
  ],
  use: [
    // Uses an external packages to get the actual compilers
    'ecmascript@0.8.3',
    'ardatan:angular-aot-compiler@0.1.5',
    'ardatan:angular-jit-compiler@0.1.5'
  ]
});

Package.onUse(function(api) {
  api.versionsFrom('1.5.2.2');

  // Required in order to register plugins
  api.use('isobuild:compiler-plugin@1.0.0');
});
