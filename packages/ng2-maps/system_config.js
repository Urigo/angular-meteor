System.config({
  packages: {
    'ng2-google-maps': {
      main: 'core',
      format: 'register',
      map: {
        '.': System.normalizeSync('{barbatus:ng2-google-maps}')
      }
    }
  }
});
