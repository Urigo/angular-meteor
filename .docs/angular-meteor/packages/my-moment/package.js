Package.describe({
  summary: "Moment.js",
  version: "0.0.1"
});

Package.on_use(function (api) {
  api.export('moment');
  api.add_files('pre-moment.js');
  api.add_files('moment.js');
  api.add_files('pre-timezone.js');
  api.add_files('moment.timezone.js');
  api.add_files('moment.timezone.america-los-angeles.js');
});
