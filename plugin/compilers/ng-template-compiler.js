var $ = Npm.require('cheerio');

class NgTemplateCompiler extends HtmlCompiler {
  constructor() {
    super('ng-template-compiler', appendHtml)
  }
}

appendHtml = (html) => {
  var $contents = $(html.contents);
  var isExtension = $contents.closest('head,body').length;
  var isNgTemplate = $contents.closest(':not(head,body)').length;

  if (isExtension && isNgTemplate)
    throw Error(html.sourceName + ' can\'t contain <head> or <body> tags with other tags in top level of template');
  if (isExtension)
    return appendExtension(html);
  if (isNgTemplate)
    return appendNgTemplate(html);
};

appendExtension = (html) => {
  var $contents = $(html.contents);
  var $head = $contents.closest('head');
  var $body = $contents.closest('body');

  return {
    head: $head.length && Utils.minifyHtml($head.html()),
    body: $body.length && Utils.minifyHtml($body.html())
  };
};

appendNgTemplate = (html) => {
  // Using JSON.stringify to escape quote characters.
  var templateModule = Utils.generateScript(tempalteModuleStatement, {
    __path: JSON.stringify(html.sourceName),
    __content: JSON.stringify(Utils.minifyHtml(html.contents))
  });

  return {
    js: templateModule
  };
};

// Evaluation function
var tempalteModuleStatement = function() {
  angular.module('angular-meteor').run(['$templateCache', function($templateCache) {
    $templateCache.put(__path, __content);
  }]);
};

this.NgTemplateCompiler = NgTemplateCompiler;
