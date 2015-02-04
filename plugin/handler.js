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
    // Since compileStep.inputPath uses backslashes on Windows, we need replace them
    // with forward slashes to be able to consistently include templates across platforms.
    // Ticket here: https://github.com/Urigo/angular-meteor/issues/169
    // A standardized solution to this problem might be on its way, see this ticket:
    // https://github.com/meteor/windows-preview/issues/47
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
