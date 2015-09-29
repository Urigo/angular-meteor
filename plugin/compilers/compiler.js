class Compiler extends CachingCompiler {
  constructor(name) {
    super({
      compilerName: name,
      defaultCacheSize: 1024 * 1024 * 10
    });
  }

  getCacheKey(file) {
    return file.getSourceHash();
  }

  compileResultSize(result) {
    return result.length;
  }

  addCompileResult(file, result) {
    if (!result) return;

    file['add' + this.fileType]({
      data: result,
      path: file.getPathInPackage()
    });
  }
}

this.Compiler = Compiler;