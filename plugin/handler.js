/**
 * Created by netanel on 01/01/15.
 */

var minify = Npm.require('html-minifier').minify;
Plugin.registerSourceHandler('tpl', {
  isTemplate: true,
  archMatching: "web"
}, function(compileStep) {
  var contents = compileStep.read().toString('utf8');

  var results = 'angular.module(\'angular-meteor\').run([\'$templateCache\', function($templateCache) {' +
    '$templateCache.put(\'' + compileStep.inputPath.replace(/\\/g, "/") + '\', \'' +
      minify(contents.replace(/'/g, "\\'"), {
        collapseWhitespace : true,
        removeComments : true,
        minifyJS : true,
        minifyCSS: true,
        processScripts : ['text/ng-template']
      }) + '\');' +
    '}]);';

  compileStep.addJavaScript({
    path : compileStep.inputPath,
    data : results,
    sourcePath : compileStep.inputPath
  });
});
