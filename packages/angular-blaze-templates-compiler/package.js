Package.describe({
  name: 'angular-blaze-templates-compiler',
  summary: 'Compile angular templates into the template cache for .ng extensions',
  version: '0.0.1',
  git: 'https://github.com/Urigo/angular-meteor.git',
  documentation: null
});

Package.registerBuildPlugin({
  name: 'compileNGTemplate',
  sources: [
    'plugin/ng-caching-html-compiler.js',
    'plugin/ng-template-compiler.js',
    'plugin/ng-annotate.js'
  ],
  use: [
    'angular-templates-runtime@0.0.1'
  ],
  npmDependencies : {
    'cheerio': '0.19.0',
    'uglify-js': '2.4.24',
    'ng-annotate': '0.15.4'
  }
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.2.0.1');
  api.use('isobuild:compiler-plugin@1.0.0');
});
