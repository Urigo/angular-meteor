System.config({
  packages: {
    'meteor-accounts': {
      main: 'main',
      format: 'register',
      map: {
        '.': System.normalizeSync('{barbatus:ng2-meteor-accounts}')
      }
    }
  }
});
