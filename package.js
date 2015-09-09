Package.describe({
  name: "angular",
  summary: "Everything you need to use AngularJS in your Meteor app",
  version: "1.0.0-rc.5",
  git: "https://github.com/Urigo/angular-meteor.git"
});

Package.registerBuildPlugin({
  name: "compileAngularTemplates",
  sources: [
    "plugin/handler.js"
  ],
  use: ['html-tools@1.0.4'],
  npmDependencies : {
    'html-minifier' : '0.6.9'
  }
});

Package.registerBuildPlugin({
  name: 'ngAnnotate',
  sources: [
    'plugin/annotate.js'
  ],
  npmDependencies: {
    'ng-annotate': '0.15.4'
  }
});

Package.on_use(function (api) {
  api.versionsFrom('METEOR@0.9.0.1');

  api.use('angular:angular@1.4.4', 'client');
  api.use('minimongo');
  // Since commit b3096e93661bc79bab73a63bae0e14643030a9a3, MongoId and
  // diff-sequence are separate packages from minimongo.
  // We need to use it for idParse, idStringify and diffQueryOrderedChanges
  // in lib/diff-array.js
  if (Package['diff-sequence']) {
    api.use('diff-sequence');
  }
  if (Package['mongo-id']) {
    api.use('mongo-id');
  }
  api.use('dburles:mongo-collection-instances@0.3.4', 'client'); // For getCollectionByName

  // Files to load in Client only.
  api.add_files([
    // Lib Files
    'lib/diff-array.js',
    'lib/get-updates.js',
    // Module Files
    'modules/angular-meteor-subscribe.js',
    'modules/angular-meteor-stopper.js',
    'modules/angular-meteor-collection.js',
    'modules/angular-meteor-object.js',
    'modules/angular-meteor-user.js',
    'modules/angular-meteor-methods.js',
    'modules/angular-meteor-session.js',
    'modules/angular-meteor-reactive-scope.js',
    'modules/angular-meteor-utils.js',
    'modules/angular-meteor-camera.js',
    // Finally load angular-meteor File
    'angular-meteor.js'
  ], 'client');
});

Package.onTest(function(api) {
  api.use('sanjo:jasmine@0.13.6');
  api.use('angular');
  api.use('angular:angular-mocks@1.4.4');
  api.use('mdg:camera@1.1.5');

  // auxiliary
  api.addFiles([
    'tests/integration/auxiliary/matchers.js',
    'tests/integration/auxiliary/test_data.js'
  ]);

  // spec files
  api.addFiles([
    'tests/integration/angular-meteor-methods-spec.js',
    'tests/integration/angular-meteor-session-spec.js',
    'tests/integration/angular-meteor-stopper-spec.js',
    'tests/integration/angular-meteor-camera-spec.js',
    'tests/integration/angular-meteor-diff-array-spec.js',
    'tests/integration/angular-meteor-get-updates-spec.js',
    'tests/integration/angular-meteor-collection-spec.js',
    'tests/integration/angular-meteor-object-spec.js',
    'tests/integration/angular-meteor-reactive-scope-spec.js',
    'tests/integration/angular-meteor-utils-spec.js',
    'tests/integration/test_collections.js'
  ], 'client');

  api.addFiles([
    'tests/integration/test_collections.js'
  ], 'server');
});
