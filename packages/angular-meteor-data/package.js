Package.describe({
  name: 'angular-meteor-data',
  summary: 'Everything you need to use AngularJS in your Meteor app',
  version: '0.2.0',
  git: 'https://github.com/Urigo/angular-meteor.git'
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.2.0.1');

  // legacy
  api.use('session@1.1.1');
  api.use('ejson@1.0.7');
  api.use('check@1.0.6');
  api.use('diff-sequence');
  api.use('mongo-id');

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

  // legacy
  api.add_files([
    // Lib Files
    'lib/diff-array.js',
    'lib/get-updates.js',
    // Module Files
    'modules/angular-meteor-subscribe.js',
    'modules/angular-meteor-stopper.js',
    'modules/angular-meteor-collection.js',
    'modules/angular-meteor-object.js',
    'modules/angular-meteor-ironrouter.js',
    'modules/angular-meteor-user.js',
    'modules/angular-meteor-methods.js',
    'modules/angular-meteor-session.js',
    'modules/angular-meteor-utils.js',
    'modules/angular-meteor-camera.js'
    ], 'client');

  api.add_files([
    'modules/utils.js',
    'modules/mixer.js',
    'modules/scope.js',
    'modules/view-model.js',
    'modules/core.js',
    'modules/reactive.js',
    'angular-meteor.js'
  ], 'client');
});

Package.onTest(function(api) {
  api.use('underscore@1.0.4');
  api.use('tracker@1.0.8');
  api.use('mongo@1.1.1');
  api.use('sanjo:jasmine@0.19.0');
  api.use('angular:angular-mocks@1.4.7');
  api.use('angular-meteor-data');

  api.addFiles([
    'tests/integration/mixer.spec.js',
    'tests/integration/view-model.spec.js',
    'tests/integration/core.spec.js',
    'tests/integration/reactive.spec.js'
  ], 'client');

  api.addFiles([
    'tests/collections.js'
  ], 'client', 'server');
});
