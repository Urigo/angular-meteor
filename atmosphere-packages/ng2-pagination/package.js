Package.describe({
  name: 'barbatus:ng2-pagination',
  version: '0.1.4_2',
  summary: 'Angular2 Pagination Components',
  git: 'https://github.com/Urigo/Meteor-Angular2/tree/master/packages/ng2-pagination',
  documentation: null
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.1');

  api.use([
    'check@1.0.5',
    'underscore@1.0.4',
    'barbatus:angular2@0.9.0'
  ]);

  api.addFiles([
    'typings/ng2-pagination.d.ts'
  ], 'server');

  api.addAssets([
    'src/pagination-controls-cmp.html',
  ], 'client');

  api.addFiles([
    'main.css',
    'src/ng2-pagination.ts',
    'src/paginate-pipe.ts',
    'src/pagination-controls-cmp.ts',
    'src/pagination-service.ts',
    'system_config.js'
  ], 'client');
});

Package.onTest(function(api) {
  api.use([
    'tinytest',
    'sanjo:jasmine@0.18.0',
    'barbatus:ng2-pagination'
  ]);
});
