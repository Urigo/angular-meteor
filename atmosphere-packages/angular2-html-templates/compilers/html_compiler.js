const $ = Npm.require('cheerio');

HtmlCompiler = class HtmlCompiler extends NgCompiler {
  constructor() {
    super();

    // Create TWO compilers, one for each possible HTML file type:
    // htmlCompiler is for the main HTML file that contains `head` or `body` tags,
    // ngTemplateCompiler is for the component templates.
    this._htmlCompiler = new NgHtmlCompiler();
    this._ngTemplateCompiler = new NgTemplateCompiler();
  }

  processFilesForTarget(files) {
    // Call the super method in order
    // to enrich the files with the FileMixin.
    super.processFilesForTarget(files);

    files = files.filter(file => !file.isFromNPM());

    var htmlFiles = [];
    var templateFiles = [];

    // Iterate all the files that needs to compile and
    // split them into HTML files and templates files.
    files.forEach((file) => {
      const $contents = $(file.getContentsAsString());
      const isHtml = !!$contents.closest('head,body').length;
      const isTemplate = !!$contents.closest(':not(head,body)').length;

      if (isHtml && isTemplate) {
        const fileName = file.getBasename();
        const errorMsg = `${fileName} has wrong layout`;
        throw Error(errorMsg);
      }

      if (isHtml) {
        htmlFiles.push(file);
      } else {
        templateFiles.push(file);
      }
    });

    // Use each compiler with it's files and compile them.
    this._htmlCompiler.processFilesForTarget(htmlFiles);
    this._ngTemplateCompiler.processFilesForTarget(templateFiles);
  }
};

// HTML compiler for main HTML file of the application.
NgHtmlCompiler = class NgHtmlCompiler extends NgCachingCompiler {
  constructor() {
    super('html-extension-compiler');
  }

  compileResultSize(result) {
    return result.head.length + result.body.length;
  }

  compileOneFile(file) {
    const $contents = $(file.getContentsAsString());
    const $head = $contents.closest('head');
    const $body = $contents.closest('body');

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

// Templates compiler that compiles template files.
NgTemplateCompiler = class NgTemplateCompiler extends NgCachingCompiler {
  constructor() {
    super('ng-template-compiler');
  }

  compileResultSize(result) {
    return result.length;
  }

  compileOneFile(file) {
    // Just pass through the file, without any modifications,
    // we do not need to modify it at all at the moment.
    return file.getContentsAsString();
  }

  addCompileResult(file, result) {
    let htmlPath = file.getPathInPackage();
    htmlPath = htmlPath.replace(".ng2.html", ".html");

    file.addAsset({
      data: result,
      path: htmlPath
    });

    // Export template URL in JS-module.
    // Issue - 275#issuecomment-220114345
    let templateUrl = `exports.default = '/${htmlPath}';`;

    file.addJavaScript({
      data: templateUrl,
      path: htmlPath,
      lazy: true
    });
  }
};
