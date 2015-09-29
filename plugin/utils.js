var htmlMinifier = Npm.require('html-minifier');
var uglify = Npm.require('uglify-js');

var registerCompiler = (extension, processHandler) => {
  Plugin.registerCompiler({
    extensions: [extension],
  }, () => {
    return { processFilesForTarget: processHandler };
  });
};

var generateScript = (fn, replacements) => {
  var script = _.reduce(replacements, (script, replacement, match) =>
    script.replace(new RegExp(match, 'g'), replacement)
  , getFnBody(fn));

  return minifyJs(script);
};

// Used on evaluation functions only, fn must be anonymous with no arguments
var getFnBody = (fn) => {
  return fn.toString().match(/^function\s\(\)\s\{((?:.|\n)*)\}$/)[1];
};

var minifyJs = (js) => {
  return uglify.minify(js, {
    fromString: true
  }).code;
};

var minifyHtml = (html) => {
 return htmlMinifier.minify(html, {
    collapseWhitespace : true,
    conservativeCollapse : true,
    minifyCSS : true,
    minifyJS : true,
    processScripts : ['text/template']
  });
};

var isClient = (file) => {
  return file.getDirname().split('/')[0] == 'client';
};

this.Utils = {
  registerCompiler,
  isClient,
  generateScript,
  minifyJs,
  minifyHtml
};