var $ = Npm.require('cheerio');

HtmlCompiler = class HtmlCompiler extends NgCompiler {
  constructor() {
    super();

    // Create TWO compilers, one for each possible HTML file type:
    // htmlCompiler is for the main HTML file that contains `head` or `body` tags
    // ngTemplateCompiler is for the templates file that does not use as main files
    this._htmlCompiler = new NgHtmlCompiler();
    this._ngTemplateCompiler = new NgTemplateCompiler();
  }

  processFilesForTarget(files) {
    // Call the super method in order to enrich the files with the FileMixin
    super.processFilesForTarget(files);

    var htmlFiles = [];
    var templateFiles = [];

    // Iterate all the files that needs to compile and split them to HTML files and templates files
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

    // Use each compiler with it's files and compile them
    this._htmlCompiler.processFilesForTarget(htmlFiles);
    this._ngTemplateCompiler.processFilesForTarget(templateFiles);
  }
};

// HTML compiler for main HTML file of the application
NgHtmlCompiler = class NgHtmlCompiler extends NgCachingCompiler {
  constructor() {
    super('html-extension-compiler');
  }

  compileResultSize(result) {
    return result.head.length + result.body.length;
  }

  compileOneFile(file) {
    console.log('Compiling main app HTML file: ' + file.getPathInPackage());

    var $contents = $(file.getContentsAsString());
    var $head = $contents.closest('head');
    var $body = $contents.closest('body');

    return {
      head: $head.html() || '',
      body: $body.html() || ''
    };
  }

  addCompileResult(file, result) {
    // TODO: Fix this, related: https://github.com/meteor/meteor/issues/6174
    try {
      file.addHtml({
        data: result.head,
        section: 'head'
      });

      file.addHtml({
        data: result.body,
        section: 'body'
      });
    }
    catch (e) {

    }
  }
};

// Templates compiler that compiles template files
NgTemplateCompiler = class NgTemplateCompiler extends NgCachingCompiler {
  constructor() {
    super('ng-template-compiler');
  }

  compileResultSize(result) {
    return result.length;
  }

  compileOneFile(file) {
    console.log('Compiling HTML template: ' + file.getPathInPackage());

    // Just pass through the file, without any modifications, we do not need to modify it at all at the moment.
    return file.getContentsAsString();
  }

  addCompileResult(file, result) {
    file.addAsset({
      data: result,
      path: file.getPathInPackage() // the path is the full path if the file comes from a package
    });
  }
};