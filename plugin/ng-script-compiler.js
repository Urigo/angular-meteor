var to5 = Npm.require('babel-core');
var fs = Npm.require('fs');
var path = Npm.require('path');
var ngAnnotate = Npm.require('ng-annotate');


Object.merge = function (destination, source) {
  for (var property in source)
    destination[property] = source[property];
  return destination;
}

var defaultConfig = {
  // print loaded config
  "debug":      false,
  // print active file extensions
  "verbose":    true,
  // babel managed extensions
  "extensions": ['es6.js', 'js', 'es6', 'jsx'],
  // experimental ES7 support
  "stage":      0,
  // module format to use
  "modules":    'common'
}

var handler = function (compileStep, isLiterate) {
  var source = compileStep.read().toString('utf8');
  //var outputFile = compileStep.inputPath + ".js";
  var outputFile = compileStep.inputPath;
  var to5output = "";

  try {
    to5output = to5.transform(source, {
      blacklist: ["useStrict"],
      sourceMap: true,
      stage:     config.stage,
      filename:  compileStep.pathForSourceMap,
      modules:   config.modules
    });
  } catch (e) {
    console.log(e); // Show the nicely styled babel error
    return compileStep.error({
      message:    'Babel transform error',
      sourcePath: compileStep.inputPath,
      line:       e.loc.line,
      column:     e.loc.column
    });
  }

  var ret = ngAnnotate(to5output.code, {
    add: true
  });

  if (ret.errors) {
    throw new Meteor.Error(ret.errors.join(': '));
  }

  compileStep.addJavaScript({
    path:       outputFile,
    sourcePath: compileStep.inputPath,
    data:       ret.src,
    sourceMap:  JSON.stringify(to5output.map)
  });
};

// initialization once at `meteor` exec
var appdir = process.env.PWD || process.cwd();
var filename = path.join(appdir, 'babel.json');
var userConfig = {};

if (fs.existsSync(filename)) {
  userConfig = JSON.parse(fs.readFileSync(filename, {encoding: 'utf8'}));
}

var config = Object.merge(defaultConfig, userConfig);

config.extensions.forEach(function (ext) {
  Plugin.registerSourceHandler(ext, handler);
});

if (config.verbose)
  console.log("Babel active on file extensions: " + config.extensions.join(', '));

if (config.debug) {
  console.log("\nBabel config:");
  console.log(config);
}
