Package.describe({
  name: 'angular2-compilers',
  version: '0.5.7',
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
    'ecmascript@0.1.6',
    'angular2-html-templates@0.5.3'
  ]
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.1');

  // Required in order to register plugins
  api.use('isobuild:compiler-plugin@1.0.0');

  // These packages are required by Angular2-Meteor NPM.
  // Make sure we have them in this package.
  api.imply([
    'barbatus:typescript@0.3.1',
    'check@1.1.0',
    'tracker@1.0.13',
    'underscore@1.0.4',
    'ejson'
  ]);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('angular2-compilers');
});
