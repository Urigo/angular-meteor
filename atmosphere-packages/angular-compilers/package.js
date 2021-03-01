Package.describe({
  name: 'angular-compilers',
  version: '0.4.0',
  summary: 'Rollup, AOT, SCSS, HTML and TypeScript compilers for Angular Meteor',
  git: 'https://github.com/Urigo/angular-meteor/tree/master/atmosphere-packages/angular-compilers',
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: 'Angular Compilers',
  sources: [
    'plugin/register.js'
  ],
  use: [
    // Uses an external packages to get the actual compilers
    'ecmascript@0.10.5',
    'angular-typescript-compiler@0.4.0',
    'angular-html-compiler@0.4.0',
    'angular-scss-compiler@0.4.0'
  ]
});

Package.onUse(function (api) {
  api.versionsFrom('1.11');

  // Required in order to register plugins
  api.use('isobuild:compiler-plugin@1.0.0');
});
