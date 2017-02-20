Package.describe({
  name: 'angular2-compilers',
  version: '0.6.6',
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
    'ecmascript@0.6.1',
    'urigo:static-html-compiler@0.1.8',
    'barbatus:css-compiler@0.3.6'
  ]
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.1');

  // Required in order to register plugins
  api.use('isobuild:compiler-plugin@1.0.0');

  // These packages are required by Angular2-Meteor NPM.
  // Make sure we have them in this package.
  api.imply([
    'barbatus:typescript@0.6.2_3',
    'check@1.1.0',
    'tracker@1.0.13'
  ]);
});

Package.onTest(function(api) {
  api.use('test-helpers');
  api.use('tinytest');
  api.use('angular2-compilers');

  api.addFiles('tests/scss/dir/subdir/_in-subdir.scss', 'client');
  api.addFiles('tests/scss/dir/_in-dir.scss', 'client');
  api.addFiles('tests/scss/dir/_in-dir2.scss', 'client');
  api.addFiles('tests/scss/dir/root.scss', 'client');
  api.addFiles('tests/scss/_emptyimport.scss', 'client');
  api.addFiles('tests/scss/_not-included.scss', 'client');
  api.addFiles('tests/scss/_top.scss', 'client');
  api.addFiles('tests/scss/_top3.scss', 'client');
  api.addFiles('tests/scss/empty.scss', 'client');
  api.addFiles('tests/scss/top2.scss', 'client');
  api.addFiles('tests.js', 'client');
});
