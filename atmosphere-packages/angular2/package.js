Package.describe({
  name: 'barbatus:angular2',
  version: '0.9.0',
  summary: 'Angular2 Npm packaged for Meteor',
  git: 'https://github.com/Urigo/angular2/tree/master/atmosphere-packages',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: 'Compilers',
  sources: [
    'plugin/registrator.js'
  ],
  use: [
    'ecmascript@0.1.4',
    'barbatus:ng2-typescript-compiler@0.5.0-beta.5'
  ]
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.1');

  api.use([
    'isobuild:compiler-plugin@1.0.0'
  ], 'server');

  api.use([
    'underscore',
    'barbatus:angular2-runtime@0.1.0',
    'systemjs:systemjs@0.18.4'
  ]);

  api.imply([
    'barbatus:angular2-runtime',
    'systemjs:systemjs',
    'barbatus:typescript-runtime@0.1.0-beta.1'
  ]);

  api.addFiles([
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
