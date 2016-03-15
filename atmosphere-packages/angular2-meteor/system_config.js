System.config({
  packages: {
    '{urigo:angular2-meteor}/.npm/package/node_modules/angular2-meteor-auto-bootstrap/modules/bootstrap': {
      map: {
        'angular2-meteor': System.normalizeSync('{urigo:angular2-meteor}/.npm/package/node_modules/angular2-meteor/modules')
      }
    },
    'angular2-meteor': {
      main: 'main',
      format: 'register',
      map: {
        '.': System.normalizeSync('{urigo:angular2-meteor}')
      }
    },
    'angular2-meteor-auto-bootstrap': {
      format: 'register',
      map: {
        '.': System.normalizeSync('{urigo:angular2-meteor}/.npm/package/node_modules/angular2-meteor-auto-bootstrap/modules')
      }
    }
  }
});