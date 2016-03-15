System.config({
  packages: {
    'ng2-pagination': {
      main: './src/ng2-pagination',
      format: 'register',
      map: {
        '.': System.normalizeSync('{barbatus:ng2-pagination}')
      }
    }
  }
});
