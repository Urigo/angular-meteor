Package.describe({
  name: "angular",
  summary: "Everything you need to use AngularJS in your Meteor app",
  version: "1.0.0-rc.7",
  git: "https://github.com/Urigo/angular-meteor.git"
});

Package.registerBuildPlugin({
  name: "compileNGTemplate",
  sources: [
    "plugin/ng-template-compiler.js"
  ],
  use: [
    'html-tools@1.0.4'
  ],
  npmDependencies : {
    'cheerio': '0.19.0',
    'html-minifier' : '0.6.9',
    'uglify-js': '2.4.24'
  }
});

Package.registerBuildPlugin({
  name: 'compileNGScript',
  sources: [
    'plugin/ng-script-compiler.js'
  ],
  npmDependencies: {
    'ng-annotate': '0.15.4'
  }
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.2.0.1');
  api.use('underscore@1.0.4');
  api.use('tracker@1.0.8');
  api.use('session@1.1.1');
  api.use('mongo@1.1.1');
  api.use('ejson@1.0.7');
  api.use('check@1.0.6');
  api.use('minimongo@1.0.9');
  api.use('observe-sequence@1.0.7');

  api.use('angular:angular@1.4.4', 'client');
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
  api.use('isobuild:compiler-plugin@1.0.0'); // Used for compilers

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
  api.use('underscore@1.0.4');
  api.use('tracker@1.0.8');
  api.use('session@1.1.1');
  api.use('mongo@1.1.1');
  api.use('sanjo:jasmine@0.19.0');
  api.use('angular:angular-mocks@1.4.4');
  api.use('mdg:camera@1.1.5');
  api.use('angular');

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
