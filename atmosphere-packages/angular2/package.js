Package.describe({
  name: 'barbatus:angular2',
  version: '0.9.0-beta.6',
  summary: 'Angular2 Npm packaged for Meteor',
  git: 'https://github.com/barbatus/angular2',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: 'Compilers',
  sources: [
    'plugin/registrator.js'
  ],
  use: [
    'ecmascript@0.1.4',
    'barbatus:ng2-typescript-compiler@0.5.0-beta.4'
  ]
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.1');

  api.use([
    'isobuild:compiler-plugin@1.0.0'
  ], 'server');

  api.use([
    'underscore',
    // This is important, i.e., adding it here
    // (before Angular2 itself) makes Angular2
    // to patch Meteor promise properly.
    'promise@0.4.8',
    'systemjs:systemjs@0.18.4'
  ]);

  api.imply([
    // Add ES6 polyfills.
    'babel-runtime',
    'systemjs:systemjs',
    'promise',
    'barbatus:typescript-runtime@0.1.0-beta.1'
  ]);

  api.addFiles([
    'dist/angular2_deps.js',
    'node_modules/angular2/bundles/angular2-polyfills.js',
    'node_modules/angular2/bundles/angular2.js',
    'node_modules/angular2/bundles/http.js',
    'node_modules/angular2/bundles/router.js',
    'node_modules/rxjs/bundles/Rx.js'
  ], 'client');

  api.addFiles([
    'system_config.js'
  ]);

  // Installs Angular2 and dependencies typings.
  api.addFiles([
    'typings/core.d.ts',
    'typings/core_amb.d.ts',
    'typings/common.d.ts',
    'typings/common_amb.d.ts',
    'typings/platform/browser.d.ts',
    'typings/platform/browser_amb.d.ts',
    'typings/router.d.ts',
    'typings/router_amb.d.ts',
    'typings/angular2.d.ts'
  ], 'server');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('barbatus:angular2');
});
