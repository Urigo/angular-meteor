Package.describe({
  name: 'angular2-compilers',
  version: '0.5.0-beta.1',
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
    'barbatus:ts-compilers@0.2.8_4',
    'ecmascript@0.3.1-modules.8',
    'angular2-html-templates@0.5.0-beta.1'
  ]
});

Package.onUse(function(api) {
  api.versionsFrom('1.3-modules-beta.8');

  // Required in order to register plugins
  api.use('isobuild:compiler-plugin@1.0.0');

  // Those implies are required by Angular2-Meteor and here in order to make sure that you have them in your project.
  api.imply([
    'check@1.1.0',
    'tracker@1.0.9',
    'underscore@1.0.4'
  ]);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('angular2-compilers');
});
