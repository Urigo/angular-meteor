var _System = {
  normalizeSync: System.normalizeSync
};

var appRegex = /^\{}\//;
var packageRegex = /^{([\w-]*?):?([\w-]+)}/;

var normalizeMeteorPackageName = function (name) {
  name = name
    .replace(appRegex, '') // {}/foo -> foo
    .replace(packageRegex, '__$1_$2'); // {author:package}/foo -> __author_package/foo
  return name;
};

System.normalizeSync = function(name, parentName) {
  return _System.normalizeSync.call(this, normalizeMeteorPackageName(name), parentName);
};

System.config({
  packages: {
    'angular2-meteor': {
      main: 'main',
      format: 'register',
      map: {
        '.': System.normalizeSync('{urigo:angular2-meteor}')
      }
    }
  },
  meta: {
    '*': {
      format: 'register'
    }
  }
});
