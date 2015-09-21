/**
 * Created by netanel on 01/01/15.
 */

var minify = Npm.require('html-minifier').minify;
Plugin.registerSourceHandler('ng.html', {
  isTemplate: true,
  archMatching: "web"
}, function(compileStep) {
  var contents = compileStep.read().toString('utf8');

  // Just parse the html to make sure it is correct before minifying
  HTMLTools.parseFragment(contents);

  // Build the templateCache prefix using the package name
  // In case the template is not from a package but the user's app there will be no prefix - client/views/my-template.ng.html
  // In case the template came from a local package the prefix will be - local-package-name_client/views/my-template.ng.html
  // In case the template came from a published package the prefix will be - developer-name_package-name_client/views/my-template.ng.html
  var packagePrefix = compileStep.packageName;
  packagePrefix = packagePrefix ? (packagePrefix.replace(/:/g, '_') + '_') : '';

  var results = 'angular.module(\'angular-meteor\').run([\'$templateCache\', function($templateCache) {' +
    // Since compileStep.inputPath uses backslashes on Windows, we need replace them
    // with forward slashes to be able to consistently include templates across platforms.
    // Ticket here: https://github.com/Urigo/angular-meteor/issues/169
    // A standardized solution to this problem might be on its way, see this ticket:
    // https://github.com/meteor/windows-preview/issues/47
    '$templateCache.put(' + JSON.stringify(packagePrefix + compileStep.inputPath.replace(/\\/g, "/")) + ', ' +
      JSON.stringify(minify(contents, {
        collapseWhitespace : true,
        conservativeCollapse : true,
        minifyJS : true,
        minifyCSS : true,
        processScripts : ['text/ng-template']
      })) + ');' +
    '}]);';

  compileStep.addJavaScript({
    path : compileStep.inputPath + '.js',
    data : results,
    sourcePath : compileStep.inputPath
  });
});
