Package.describe({
  name: "urigo:angular",
  summary: "Deprecated: use the official `angular` package instead!",
  version: "1.2.2",
  git: "https://github.com/Urigo/angular-meteor.git",
  documentation: null
});

Package.on_use(function (api) {
  api.imply("angular@1.2.2");
});