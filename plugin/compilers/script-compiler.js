class ScriptCompiler extends Compiler {
  constructor() {
    super('script-compiler');
    this.fileType = 'JavaScript';
  }

  compileOneFile(file) {
    return file.getContentsAsString();
  }
}

this.ScriptCompiler = ScriptCompiler;
