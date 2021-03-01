Package.describe({
  name: 'angular-typescript-compiler',
  version: '0.4.0',
  summary: 'Angular TypeScript Compiler Package',
  git: 'https://github.com/Urigo/angular-meteor/tree/master/atmosphere-packages/angular-typescript-compiler',
  documentation: null
});

Npm.depends({
  "meteor-typescript": "0.9.0",
  rollup: "2.26.11",
  "rollup-plugin-node-resolve": "5.2.0",
  "rollup-plugin-hypothetical": "2.1.0",
  "rollup-plugin-commonjs": "10.1.0",
});

Package.onUse(function (api) {
  api.versionsFrom("1.11");
  api.use(
    [
      "ecmascript",
      "babel-compiler@7.5.3",
      "angular-html-compiler@0.4.0",
      "angular-scss-compiler@0.4.0",
    ],
    "server"
  );
  api.mainModule('index.js', 'server');
});