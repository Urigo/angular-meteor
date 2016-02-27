System.config({
  packages: {
    'meteor-accounts-ui': {
      main: 'main',
      format: 'register',
      map: {
        '.': System.normalizeSync('{barbatus:ng2-meteor-accounts-ui}')
      }
    }
  }
});
