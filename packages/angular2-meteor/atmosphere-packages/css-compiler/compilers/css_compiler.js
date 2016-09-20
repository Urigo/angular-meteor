CssCompiler = class CssCompiler {
  processFilesForTarget(files) {
    files.forEach(file => {
      this.addCompileResult(file, {
        css: file.getContentsAsString(),
        sourceMap: null
      }, true);
    });
  }
};

classMixin(CssCompiler, BasicCompiler); 
