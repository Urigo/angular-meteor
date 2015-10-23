var to5 = Npm.require('babel-core');
var fs = Npm.require('fs');
var path = Npm.require('path');

var ngAnnotate = Npm.require('ng-annotate');

Object.merge = function (destination, source) {
  for (var property in source)
    destination[property] = source[property];
  return destination;
}

var config = {
  // print loaded config
  "debug":      false,
  // print active file extensions
  "verbose":    true,
  // experimental ES7 support
  "stage":      0,
  // module format to use
  "modules":    'common'
}

var processFiles = function(files) {
  files.forEach(processFile);
};

var processFile = function(file) {

  var source = file.getContentsAsString();
  var outputFile = file.getPathInPackage();
  var to5output = "";

  console.log('Babel compiling: ', outputFile);

  try {
    to5output = to5.transform(source, {
      // The blacklisting of "userStrict" is required to support
      // Meteor's file level declarations that Meteor can export
      // from packages.
      blacklist: ["useStrict"],
      sourceMap: true,
      stage:     config.stage,
      filename:  file.getDisplayPath(),
      modules:   config.modules
    });
  } catch (e) {
    console.log(e); // Show the nicely styled babel error
    return file.error({
      message: 'Babel transform error',
      line:    e.loc.line,
      column:  e.loc.column
    });
  }

  //var annotated = { src: to5output.code };

  //to5output = source;

  var annotated = ngAnnotate(to5output.code, {
    add: true
  });

  if (annotated.errors) {
    throw new Error(annotated.errors.join(': \n\n'));
  }

  file.addJavaScript({
    data: annotated.src,
    path: outputFile
  });
};

Plugin.registerCompiler({
  extensions: ['js'],
  filenames: []

}, function() {
  return { processFilesForTarget: processFiles };
});
