Package.describe({
  name: 'angular-templates',
  summary: 'Compile angular templates into the template cache',
  version: '1.0.9',
  git: 'https://github.com/Urigo/angular-meteor.git',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: 'compileNGTemplate',
  sources: [
    'plugin.js'
  ],
  use: [
    'urigo:static-html-compiler@0.1.8',
    'ecmascript@0.2.0'
  ]
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.2.0.1');
  api.use('isobuild:compiler-plugin@1.0.0');
  api.use('angular-meteor-data@1.3.9', 'client', { weak: true });
  api.use('angular:angular@1.4.8', 'client', { weak: true });

  api.addFiles('templates-handler.js', 'client');
});
