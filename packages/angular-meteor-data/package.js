Package.describe({
  name: 'angular-meteor-data',
  summary: 'Everything you need to use AngularJS in your Meteor app',
  version: '0.2.0',
  git: 'https://github.com/Urigo/angular-meteor.git'
});

Npm.depends({
  'angular-meteor': '1.3.6'
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.2.0.1');

  // legacy
  api.use('session@1.1.1');
  api.use('ejson@1.0.7');
  api.use('check@1.0.6');
  api.use('diff-sequence');
  api.use('mongo-id');
  api.use('dburles:mongo-collection-instances@0.3.4', 'client'); // For getCollectionByName

  api.use('underscore@1.0.4');
  api.use('tracker@1.0.8');
  api.use('mongo@1.1.1');
  api.use('minimongo@1.0.9');
  api.use('observe-sequence@1.0.7');
  api.use('ecmascript');
  api.use('reactive-var');
  api.use('benjamine:jsondiffpatch@0.1.38_1');
  api.use('angular:angular@1.4.8', 'client');
  api.use('isobuild:compiler-plugin@1.0.0');

  api.use('mdg:camera@1.1.5');

  api.add_files([
    '.npm/package/node_modules/angular-meteor/dist/angular-meteor.js'
  ], 'client', {
    transpile: false
  });
});
