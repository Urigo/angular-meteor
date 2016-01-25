var $ = cheerio;

HtmlCompiler = class HtmlCompiler extends NgCompiler {
  constructor(bootstrapHtml) {
    super();

    this._bootstrapHtml = bootstrapHtml;
    this._htmlCompiler = new NgHtmlCompiler();
    this._ngTemplateCompiler = new NgTemplateCompiler();
  }

  processFilesForTarget(files) {
    super.processFilesForTarget(files);

    var htmlFiles = [];
    var templateFiles = [];

    files.forEach((file) => {
      var $contents = $(file.getContentsAsString());
      var isHtml = $contents.closest('head,body').length;
      var isTemplate = $contents.closest(':not(head,body)').length;

      if (isHtml && isTemplate) {
        var fileName = file.getBasename();
        var errorMsg = `${fileName} has wrong layout`;
        throw Error(errorMsg);
      }

      if (isHtml > 0) {
        htmlFiles.push(file);
      } else {
        templateFiles.push(file);
      }
    });

    // If there is no html then add provided boostrap html
    // to the body. It raises the issue though:
    // if no html at all the boostrap won't be added.
    if (htmlFiles.length == 0) {
      try {
        templateFiles[0].addHtml({
          data: this._bootstrapHtml,
          section: 'body'
        });
      }
      catch (e) {
        // Not sure what to do in this case... the exception is: Document sections can only be emitted to web targets
      }
    }

    this._htmlCompiler.processFilesForTarget(htmlFiles);
    this._ngTemplateCompiler.processFilesForTarget(templateFiles);
  }
};

class NgHtmlCompiler extends NgCachingCompiler {
  constructor() {
    super('html-extension-compiler');
  }

  compileResultSize(result) {
    return result.head.length + result.body.length;
  }

  compileOneFile(file) {
    var $contents = $(file.getContentsAsString());
    var $head = $contents.closest('head');
    var $body = $contents.closest('body');

    return {
      head: $head.html() || '',
      body: $body.html() || ''
    };
  }

  addCompileResult(file, result) {
    file.addHtml({
      data: result.head,
      section: 'head'
    });

    file.addHtml({
      data: result.body,
      section: 'body'
    });
  }
};

NgTemplateCompiler = class NgTemplateCompiler extends NgCachingCompiler {
  constructor() {
    super('ng-template-compiler');
  }

  compileResultSize(result) {
    return result.length;
  }

  compileOneFile(file) {
    return file.getContentsAsString();
  }

  addCompileResult(file, result) {
    file.addAsset({
      data: result,
      path: file.getPathInPackage()
    });
  }
};