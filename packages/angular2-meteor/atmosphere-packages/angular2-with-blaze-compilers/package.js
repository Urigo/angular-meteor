Package.describe({
  name: 'angular2-with-blaze-compilers',
  version: '0.6.5',
  summary: 'Angular 2 Templates, HTML and TypeScript compilers for Meteor applications with Blaze',
  git: 'https://github.com/Urigo/angular2-meteor/',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: 'Angular2 Compilers (Blaze)',
  sources: [
    'plugin/register.js'
  ],
  use: [
    // Uses an external packages to get the actual compilers
    'ecmascript@0.4.3',
    'urigo:static-html-compiler@0.1.8',
    'barbatus:css-compiler@0.3.4'
  ]
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.1');

  // Required in order to register plugins
  api.use('isobuild:compiler-plugin@1.0.0');

  // These packages are required by Angular2-Meteor NPM.
  // Make sure we have them in this package.
  api.imply([
    'barbatus:typescript@0.5.2',
    'check@1.1.0',
    'tracker@1.0.13'
  ]);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('angular2-with-blaze-compilers');
});
