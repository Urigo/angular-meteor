Package.describe({
  name: 'ardatan:angular-compilers',
  version: '0.1.9',
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
    'ardatan:angular-ts-compiler@0.1.9',
    'ardatan:angular-html-compiler@0.1.9',
    'ardatan:angular-scss-compiler@0.1.9'
  ]
});

Package.onUse(function(api) {
  api.versionsFrom('1.5.2.2');

  // Required in order to register plugins
  api.use('isobuild:compiler-plugin@1.0.0');
});
