
/**
 * Top styles compiler that defines
 * compilers for diff style types.
 */
StyleCompiler = class StyleCompiler {
  constructor(addCompileResult) {
    let scss = new SassCompilerExtended(addCompileResult);
    this.compilers = {
      css: new CssCompiler(addCompileResult),
      less: new LessCompiler(addCompileResult),
      scss: scss,
      sass: scss
    };
  }

  processFilesForTarget(files) {
    for (let ex in this.compilers) {
      let exFiles = files.filter(file => file.getExtension() === ex);
      this.compilers[ex].processFilesForTarget(exFiles);
    }
  }
};
