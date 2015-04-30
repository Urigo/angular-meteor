Package.describe({
  name: "urigo:angularmeteormarkdown",
  summary: "The simplest no-conflict way to use AngularJS with Meteor, Meteorite and Atmosphere Smart Packages.",
  version: "1.0.0"
});

Package.registerBuildPlugin({
  name: "compileMarkdownTemplates",
  sources: [
    "handler.js"
  ]
});

Package.on_use(function (api) {
  api.versionsFrom('METEOR@0.9.0.1');

  // Files to load in Client only.
  api.add_files('markdown.js', 'client');
});
