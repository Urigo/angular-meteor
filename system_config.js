System.config({
  packages: {
    'angular2-meteor': {
      main: 'main',
      format: 'register',
      map: {
        '.': System.normalizeSync('{urigo:angular2-meteor}')
      }
    }
  }
});
