System.config({
  packages: {
    'angular2-meteor-auto-bootstrap': {
      main: 'main',
      format: 'register',
      map: {
        '.': System.normalizeSync('{angular2-meteor}/.npm/package/node_modules/angular2-meteor-auto-bootstrap/modules')
      }
    },
    'angular2-meteor': {
      main: 'main',
      format: 'register',
      map: {
        '.': System.normalizeSync('{angular2-meteor}/.npm/package/node_modules/angular2-meteor/modules')
      }
    }
  }
});