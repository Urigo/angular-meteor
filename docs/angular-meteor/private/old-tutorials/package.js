Package.describe({
  summary: "Tutorial content, included in meteor.com via package",
  version: "0.0.1",
  name: "tutorials"
});

Package.registerBuildPlugin({
  name: "Git patch compiler",
  sources: ["git-patch-viewer/patch-plugin.jsx"],
  use: [
    "jsx@0.1.1",
    "underscore@1.0.3"
  ]
})

Package.onUse(function (api) {
  api.versionsFrom("1.1.0.2");
  api.use([
    'simple:markdown-templating@1.2.7',
    'templating',
    'underscore',
    'jsx@0.1.1',
    'simple:highlight.js@1.0.9',
    'reactive-var',
    'less'
  ]);

  api.addFiles([
    "git-patch-viewer/patch-viewer.html",
    "git-patch-viewer/patch-viewer.jsx",
    "git-patch-viewer/patch-viewer.less"
  ], "client");

  api.addFiles([
    'generated/blaze-commits.js',
    'generated/angular-commits.js',
    'generated/react-commits.js',
    'routes/angular2Tut.js',
    'routes/angular1Tut.js',
    'routes/reactTut.js',
    'routes/ionicTut.js',
    'routes/tutorial-pages.js'
  ]);

  api.addFiles([
    'steps/angular/step01.md',
    'steps/angular/step02.md',
    'steps/angular/step03.md',
    'steps/angular/step04.md',
    'steps/angular/step05.md',
    'steps/angular/step07.md',
    'steps/angular/step08.md',
    'steps/angular/step09.md',
    'steps/angular/step10.md',
    'steps/angular/step11.md',
    'steps/angular/step12.md',
    'steps/blaze/step01.md',
    'steps/blaze/step02.md',
    'steps/blaze/step03.md',
    'steps/blaze/step04.md',
    'steps/blaze/step05.md',
    'steps/blaze/step08.md',
    'steps/blaze/step09.md',
    'steps/blaze/step10.md',
    'steps/blaze/step11.md',
    'steps/blaze/step12.md',
    'steps/react/step01.md',
    'steps/react/step02.md',
    'steps/react/step03.md',
    'steps/react/step04.md',
    'steps/react/step05.md',
    'steps/react/step08.md',
    'steps/react/step09.md',
    'steps/react/step10.md',
    'steps/react/step11.md',
    'steps/react/step12.md',
    'steps/step00.html',

    'shared/explanations.md',
    'shared/code.md',
    'shared/step06.md',
    'shared/step07.md',

    'shared/code-box.html',
    'shared/code-box.js',

    'generated/react.multi.patch',
    'generated/blaze.multi.patch'
  ], 'client');

  // Also, exports all of the templates from the steps/ directory
  api.export('TUTORIAL_PAGES');

  api.export('REACT_TUT');
  api.export('ANGULAR2_TUT');
  api.export('ANGULAR1_TUT');
  api.export('IONIC_TUT');

  // For easier debugging
  api.export('GitPatches');
});
