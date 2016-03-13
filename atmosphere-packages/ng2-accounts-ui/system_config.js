System.config({
  packages: {
    'meteor-accounts-ui': {
      main: 'main',
      format: 'register',
      map: {
        '.': System.normalizeSync('barbatus_ng2-meteor-accounts-ui')
      }
    }
  }
});
