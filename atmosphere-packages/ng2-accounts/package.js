Package.describe({
  name: 'barbatus:ng2-meteor-accounts',
  version: '0.1.8_2',
  summary: 'Meteor Accounts for Angular2',
  git: 'https://github.com/Urigo/angular2-meteor/tree/master/packages/ng2-accounts',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.1');

  api.use([
    'accounts-base@1.2.1',
    'promise@0.4.8',
    'barbatus:angular2@0.9.0'
  ]);

  api.addFiles([
    'typings/ng2-meteor-accounts.d.ts'
  ], 'server');

  api.addFiles([
    'accounts_service.ts',
    'annotations.ts',
    'main.ts',
    'system_config.js',
  ]);
});

Package.onTest(function(api) {
  api.use([
    'tinytest',
    'sanjo:jasmine@0.18.0',
    'barbatus:ng2-meteor-accounts'
  ]);

  api.addFiles([
    'tests/client/unit/annotations_spec.js'
  ], 'client');
});

