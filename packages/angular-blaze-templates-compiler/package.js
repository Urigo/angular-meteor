Package.describe({
  name: "angular-blaze-templates-compiler",
  summary: "Compile angular templates into the template cache for .ng extensions",
  version: "0.0.1",
  git: "https://github.com/Urigo/angular-meteor.git",
  documentation: null
});

Package.registerBuildPlugin({
  name: "compileNGTemplate",
  sources: [
    "plugin/ng-caching-html-compiler.js",
    "plugin/ng-html-scanner.js",
    "plugin/ng-template-compiler.js",
    "plugin/ng-annotate.js"
  ],
  use: [
    'caching-html-compiler@1.0.2',
    'ecmascript@0.1.6',
    'templating-tools@1.0.0',
    'underscore@1.0.4',
    'html-tools@1.0.5'
  ],
  npmDependencies : {
    'cheerio': '0.19.0',
    'html-minifier' : '0.6.9',
    'uglify-js': '2.4.24',
    'ng-annotate': '0.15.4'
  }
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.2.0.1');
  api.use('isobuild:compiler-plugin@1.0.0');
});
