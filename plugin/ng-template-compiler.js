var $ = Npm.require('cheerio');
var htmlMinifier = Npm.require('html-minifier');
var uglify = Npm.require('uglify-js');

var processFiles = function(files) {
  files.forEach(function(file) {
    var isClient = file.getDirname().split('/')[0] == 'client';

    if (isClient)
      processAppTemplate(file);
    else
      processRegularTemplate(file);
  });
};

var processAppTemplate = (function() {
  var processFile = function(file) {
    var $contents = $(file.getContentsAsString());
    var isIndexTemplate = $contents.closest('head,body').length;
    var isAngularTemplate = $contents.closest(':not(head,body)').length;

    if (isIndexTemplate && isAngularTemplate)
      throw Error(file.getBasename() + ' can\'t contain <head> or <body> tags with other tags in top level of template');
    if (isIndexTemplate)
      return processIndexTemplate(file);
    if (isAngularTemplate)
      return processAngularTemplate(file);
  };

  var processIndexTemplate = function(file) {
    var $contents = $(file.getContentsAsString());
    var $head = $contents.closest('head');
    var $body = $contents.closest('body');

    if ($head.length)
      file.addHtml({
        data: minifyHtml($head.html()),
        section: 'head'
      });

    if ($body.length)
      file.addHtml({
        data: minifyHtml($body.html()),
        section: 'body'
      });
  };

  var processAngularTemplate = function(file) {
    // Build the templateCache prefix using the package name
    // In case the template is not from a package but the user's app there will be no prefix - client/views/my-template.ng.html
    // In case the template came from a package the prefix will be - my-app_my-package_client/views/my-template.ng.html
    var packagePrefix = file.getPackageName();
    packagePrefix = packagePrefix ? (packagePrefix.replace(/:/g, '_') + '_') : '';

    // Dirname returned with forward slashes which fixes back slashes issue on windows' paths,
    // see ticket: https://github.com/Urigo/angular-meteor/issues/169.
    // Using JSON.stringify to escape quote characters.
    var templatePath = JSON.stringify(packagePrefix + file.getDirname() + '/' + file.getBasename());
    var templateContent = JSON.stringify(minifyHtml(file.getContentsAsString()));

    var templateScript = getFnBody(templateScriptTemplate)
      .replace('_$templatePath_', templatePath)
      .replace('_$templateContent_', templateContent);

    file.addJavaScript({
      path: file.getPathInPackage() + '.js',
      data: minifyJs(templateScript),
      bare: true
    });
  };

  var templateScriptTemplate = function() {
    angular.module('angular-meteor').run(['$templateCache', function($templateCache) {
      $templateCache.put(_$templatePath_, _$templateContent_);
    }]);
  };

  return processFile;
})();

var processRegularTemplate = (function() {
  var processFile = function(file) {
    file.addAsset({
      path: file.getPathInPackage(),
      data: minifyHtml(file.getContentsAsString())
    });
  };

  return processFile;
})();

var getFnBody = function(fn) {
  return fn.toString().match(/^function\s\(\)\s\{((?:.|\n)*)\}$/)[1];
};

var minifyJs = function(js) {
  return uglify.minify(js, {
    fromString: true
  }).code;
};

var minifyHtml = function(html) {
  // Just parse the html to make sure it is correct before minifying
  HTMLTools.parseFragment(html);

  return htmlMinifier.minify(html, {
    collapseWhitespace : true,
    conservativeCollapse : true,
    minifyCSS : true,
    minifyJS : true,
    processScripts : ['text/template']
  });
};

Plugin.registerCompiler({
  extensions: ['html'],
  filenames: []

}, function() {
  return { processFilesForTarget: processFiles };
});