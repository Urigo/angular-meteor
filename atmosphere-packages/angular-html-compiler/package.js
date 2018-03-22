Package.describe({
  name: 'angular-html-compiler',
  version: '0.3.1_2',
  summary: 'Angular Html Compiler Package',
  git: 'https://github.com/Urigo/angular-meteor/tree/master/atmosphere-packages/angular-html-compiler',
  documentation: null
});

Npm.depends({
  'cheerio': '0.22.0'
});

Package.onUse(function(api) {
  api.versionsFrom('1.6.1');
  api.use([
    'ecmascript'
  ], 'server');
  api.mainModule('index.js', 'server');
});
