var $ = Npm.require('cheerio');
var htmlMinifier = Npm.require('html-minifier');
var uglify = Npm.require('uglify-js');

var processFiles = function(files) {
  files.forEach(function(file) {
    var isClient = file.getDirname().split('/')[0] == 'client';

    if (isClient)
      appTemplate.process(file);
    else
      regularTemplate.process(file);
  });

  appTemplate.drain();
};

var appTemplate = (function() {
  // The following variables stores data for the draining process
  var file;
  var ngTemplatesCache = [];

  var processFile = function(file) {
    var $contents = $(file.getContentsAsString());
    var isIndexTemplate = $contents.closest('head,body').length;
    var isAngularTemplate = $contents.closest(':not(head,body)').length;

    if (isIndexTemplate && isAngularTemplate)
      throw Error(file.getBasename() + ' can\'t contain <head> or <body> tags with other tags in top level of template');
    if (isIndexTemplate)
      return processIndexTemplate(file);
    if (isAngularTemplate)
      return processNgTemplate(file);
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

  var processNgTemplate = function() {
    // Init variable in outer scope
    file = arguments[0];
    // Build the templateCache prefix using the package name
    // In case the template is not from a package but the user's app there will be no prefix - client/views/my-template.ng.html
    // In case the template came from a package the prefix will be - my-app_my-package_client/views/my-template.ng.html
    var packageName = file.getPackageName() || '';
    var packagePrefix = packageName && packageName.replace(':', '_') + '_';

    // Dirname returned with forward slashes which fixes back slashes issue on windows' paths,
    // see ticket: https://github.com/Urigo/angular-meteor/issues/169.
    // Using JSON.stringify to escape quote characters.
    ngTemplatesCache.push({
      __path: JSON.stringify(packagePrefix + file.getDirname() + '/' + file.getBasename()),
      __content: JSON.stringify(minifyHtml(file.getContentsAsString()))
    });
  };

  // Creates a module which stores all angular templates
  var drainNgTemplates = function() {
    if (!file) return;

    // Splicing for next drain
    var storeTemplates = ngTemplatesCache.splice(0).map(function(template) {
      return generateScript(storeTemplateStatement, template);
    }).join('');

    var templatesModule = generateScript(tempaltesModuleStatement, {
      __body: storeTemplates
    });

    file.addJavaScript({
      path: 'templates.js',
      data: templatesModule,
      bare: true
    });

    // Nullify for next drain
    file = null;
  };

  /* Evaluation functions */

  var tempaltesModuleStatement = function() {
    angular.module('angular-meteor.templates', []).run(['$templateCache', function($templateCache) {
      __body
    }]);
  };

  var storeTemplateStatement = function() {
    $templateCache.put(__path, __content);
  };

  return {
    process: processFile,
    drain: drainNgTemplates
  };
})();

var regularTemplate = (function() {
  var processFile = function(file) {
    file.addAsset({
      path: file.getPathInPackage(),
      data: minifyHtml(file.getContentsAsString())
    });
  };

  return {
    process: processFile
  };
})();

var generateScript = function(fn, replacements) {
  var script = Object.keys(replacements).reduce(function(script, match) {
    return script.replace(new RegExp(match, 'g'), replacements[match]);
  }, getFnBody(fn));

  return minifyJs(script);
};

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