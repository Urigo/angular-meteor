Package.describe({
  name: 'barbatus:ng2-meteor-accounts',
  version: '0.1.3_2',
  summary: 'Meteor Accounts for Angular2',
  git: 'https://github.com/barbatus/ng2-meteor-accounts',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.1');

  api.use([
    'accounts-base@1.2.1',
    'promise@0.4.8',
    'barbatus:angular2@0.7.0'
  ]);

  api.addFiles([
    'typings/meteor-accounts.d.ts'
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
});
