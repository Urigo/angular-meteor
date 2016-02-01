NgCachingHtmlCompiler = class NgCachingHtmlCompiler extends CachingHtmlCompiler {

  getCacheKey(inputFile) {
    // Note: we include the path for files that are renamed
    return [
      inputFile.getPackageName(),
      inputFile.getPathInPackage(),
      inputFile.getSourceHash()
    ];
  }

  compileOneFile(inputFile) {
    const contents = inputFile.getContentsAsString();
    var packagePrefix = '';

    if (inputFile.getPackageName()) {
      packagePrefix += '/packages/' + inputFile.getPackageName() + '/';
    }

    const inputPath = packagePrefix + inputFile.getPathInPackage();
    try {
      const tags = this.tagScannerFunc({
        sourceName: inputPath,
        contents: contents,
        tagNames: ["body", "head", "template"]
      });

      return this.tagHandlerFunc(tags);
    } catch (e) {
      if (e instanceof TemplatingTools.CompileError) {
        inputFile.error({
          message: e.message,
          line: e.line
        });
        return null;
      } else {
        throw e;
      }
    }
  }
};
