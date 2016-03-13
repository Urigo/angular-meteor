System.config({
  packages: {
    'urigo_angular2-meteor/.npm/package/node_modules/angular2-meteor-auto-bootstrap/modules/bootstrap': {
      map: {
        'angular2-meteor': System.normalizeSync('urigo_angular2-meteor/.npm/package/node_modules/angular2-meteor/modules')
      }
    },
    'angular2-meteor': {
      main: 'main',
      format: 'register',
      map: {
        '.': System.normalizeSync('urigo_angular2-meteor')
      }
    }
  }
});