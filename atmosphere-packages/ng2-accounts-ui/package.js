Package.describe({
  name: 'barbatus:ng2-meteor-accounts-ui',
  version: '0.1.4_2',
  summary: 'Meteor Accounts UI for Angular2',
  git: 'https://github.com/Urigo/angular2-meteor/tree/master/packages/ng2-accounts-ui',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.1');

  api.use([
    'accounts-ui@1.1.6',
    'templating',
    'barbatus:angular2@0.9.0'
  ]);

  api.addFiles([
    'typings/ng2-meteor-accounts-ui.d.ts'
  ], 'server');

  api.addFiles([
    'styles.css',
    'accounts_ui.ts',
    'main.ts',
    'system_config.js'
  ], 'client');
});

Package.onTest(function(api) {
  api.use([
    'tinytest',
    'sanjo:jasmine@0.18.0',
    'barbatus:ng2-meteor-accounts-ui'
  ]);
});
