var dts = require('dts-bundle');

dts.bundle({
  name: 'angular2/common',
  main: 'node_modules/angular2/common.d.ts',
  out: '../../typings/common.d.ts',
  referenceExternals: false
});

dts.bundle({
  name: 'angular2/core',
  main: 'node_modules/angular2/core.d.ts',
  out: '../../typings/core.d.ts',
  referenceExternals: false
});

dts.bundle({
  name: 'angular2/router',
  main: 'node_modules/angular2/router.d.ts',
  out: '../../typings/router.d.ts',
  referenceExternals: false
});

dts.bundle({
  name: 'angular2/http',
  main: 'node_modules/angular2/http.d.ts',
  out: '../../typings/http.d.ts',
  referenceExternals: false
});

dts.bundle({
  name: 'angular2/platform/browser',
  main: 'node_modules/angular2/platform/browser.d.ts',
  out: '../../../typings/platform/browser.d.ts',
  referenceExternals: false
});
