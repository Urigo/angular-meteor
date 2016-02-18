Package.describe({
  name: 'angular-meteor-test'
});

Package.onTest(function(api) {
  api.use('sanjo:jasmine@0.19.0');
  api.use('angular:angular-mocks@1.4.7');

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

  api.addFiles([
    '../dist/angular-meteor.js'
  ], 'client');

  api.addFiles([
    'integration/mixer.spec.js',
    'integration/view-model.spec.js',
    'integration/core.spec.js',
    'integration/reactive.spec.js'
  ], 'client');

  api.addFiles([
    'collections.js'
  ], 'client', 'server');

  // legacy
  api.addFiles([
    // auxiliary
    'integration/auxiliary/test_data.js',
    'integration/auxiliary/matchers.js',
    // modules
    'integration/pre1.3/angular-meteor-get-updates-spec.js',
    'integration/pre1.3/angular-meteor-diff-array-spec.js'
  ], 'client');
});
