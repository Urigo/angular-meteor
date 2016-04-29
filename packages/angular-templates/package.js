Package.describe({
  name: 'angular-templates',
  summary: 'Compile angular templates into the template cache',
  version: '1.0.2',
  git: 'https://github.com/Urigo/angular-meteor.git',
  documentation: null
});

Package.registerBuildPlugin({
  name: 'compileNGTemplate',
  sources: [
    'plugin/ng-caching-html-compiler.js',
    'plugin/ng-template-compiler.js'
  ],
  use: [
    'angular-templates-runtime@0.0.1'
  ],
  npmDependencies : {
    'cheerio': '0.19.0',
    'uglify-js': '2.4.24'
  }
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.2.0.1');
  api.use('isobuild:compiler-plugin@1.0.0');
  api.use('angular-meteor-data@1.3.9', 'client', { weak: true });
  api.use('angular:angular@1.4.8', 'client', { weak: true });

  api.addFiles('templates-handler.js', 'client');
});
