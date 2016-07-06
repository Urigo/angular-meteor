
/**
 * Top styles compiler that defines
 * compilers for diff style types.
 */
StyleCompiler = class StyleCompiler {
  constructor() {
    this.compilers = {
      css: new CssCompiler(),
      less: new LessCompiler()
    };
  }

  processFilesForTarget(files) {
    for (let ex in this.compilers) {
      let exFiles = files.filter(file => file.getExtension() === ex);
      this.compilers[ex].processFilesForTarget(exFiles);
    }
  }
};
