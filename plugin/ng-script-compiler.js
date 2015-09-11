var ngAnnotate = Npm.require('ng-annotate');

var processFiles = function(files) {
  files.forEach(processFile);
};

var processFile = function(file) {
  var annotated = ngAnnotate(file.getContentsAsString(), {
    add: true
  });

  if (annotated.errors) {
    throw new Error(annotated.errors.join(': '));
  }

  file.addJavaScript({
    data: annotated.src,
    path: file.getPathInPackage()
  });
};

Plugin.registerCompiler({
  extensions: ['js'],
  filenames: []

}, function() {
  return { processFilesForTarget: processFiles };
});
