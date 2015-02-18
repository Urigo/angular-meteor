Package.describe({
  summary: "The simplest no-conflict way to use AngularJS with Meteor, Meteorite and Atmosphere Smart Packages.",
  version: "0.6.8",
  git: "https://github.com/Urigo/angular-meteor.git"
});

Package.registerBuildPlugin({
  name: "compileAngularTemplates",
  sources: [
    "plugin/handler.js"
  ],
  npmDependencies : {
    'html-minifier' : '0.6.9'
  }
});

Package.on_use(function (api) {
  api.versionsFrom('METEOR@0.9.0.1');

  api.use('angularjs:angular@1.3.13', 'client');
  api.use('minimongo');  // for idStringify
  api.use('observe-sequence');
  api.use('dburles:mongo-collection-instances@0.3.1', 'client'); // For getCollectionByName

  // Files to load in Client only.
  api.add_files([
    // Lib Files
    'lib/angular-hash-key-copier.js',
    'lib/diff-array.js',
    // Module Files
    'modules/angular-meteor-subscribe.js',
    'modules/angular-meteor-collections.js',
    'modules/angular-meteor-meteorCollection.js',
    'modules/angular-meteor-object.js',
    'modules/angular-meteor-template.js',
    'modules/angular-meteor-user.js',
    'modules/angular-meteor-methods.js',
    'modules/angular-meteor-session.js',
    'modules/angular-meteor-reactive-scope.js',
    'modules/angular-meteor-utils.js',
    // Finally load angular-meteor File
    'urigo:angular.js'
  ], 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('minimongo');
  api.use(['test-helpers'], ['client']);

  api.addFiles([
    'node_modules/angular/angular.js',
    'urigo:angular.js',
    'lib/angular-hash-key-copier.js',
    'lib/diff-array.js',
    'modules/angular-meteor-collections.js',
    'modules/angular-meteor-meteorCollection.js',
    'modules/angular-meteor-methods.js',
    'modules/angular-meteor-object.js',
    'modules/angular-meteor-reactive-scope.js',
    'modules/angular-meteor-session.js',
    'modules/angular-meteor-subscribe.js',
    'modules/angular-meteor-template.js',
    'modules/angular-meteor-user.js',
    'modules/angular-meteor-utils.js',
    'test/meteor/tests.js'
  ], ['client']);
});
