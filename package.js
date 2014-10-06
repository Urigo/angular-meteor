Package.describe({
  summary: "The simplest no-conflict way to use AngularJS with Meteor, Meteorite and Atmosphere Smart Packages.",
  version: "0.3.5",
  git: "https://github.com/Urigo/ngMeteor.git"
});

Package.on_use(function (api) {
  api.versionsFrom('METEOR@0.9.0.1');
  // Exports the ngMeteor package scope
  api.export('ngMeteor', 'client');

  api.use('jquery', 'client');

  // Including bower
  api.use('mquandalle:bower@0.1.11', 'client');
  api.add_files('smart.json', 'client');

  // Files to load in Client only.
  api.add_files([
    // Lib Files
    'lib/angular-hash-key-copier.js',
    // Module Files
    'modules/ngMeteor-subscribe.js',
    'modules/ngMeteor-collections.js',
    'modules/ngMeteor-template.js',
    'modules/ngMeteor-user.js',
    // Finally load ngMeteor File
    'urigo:ngmeteor.js'
  ], 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('urigo:ngmeteor');
  api.addFiles('urigo:ngmeteor-tests.js');
});
