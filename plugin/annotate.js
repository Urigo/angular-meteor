
var ngAnnotate = Npm.require('ng-annotate');

Plugin.registerSourceHandler('ng.js', {
  isTemplate: true,
  archMatching: 'web'
}, function(compileStep) {

  var ret = ngAnnotate(compileStep.read().toString('utf8'), {
    add: true
  });

  compileStep.addJavaScript({
    path : compileStep.inputPath,
    data : ret.src,
    sourcePath : compileStep.inputPath
  });
});
