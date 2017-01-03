
SassCompilerExtended = class SassCompilerExtended extends SassCompiler {
  constructor(addCompileResult) {
    super();
    this.customAddCompileResult = addCompileResult;
  }
};

classMixin(SassCompilerExtended, BasicCompiler);
