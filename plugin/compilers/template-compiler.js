class TemplateCompiler extends Compiler {
  constructor() {
    super('template-compiler');
    this.fileType = 'Asset';
  }

  compileOneFile(file) {
    return Utils.minifyHtml(file.getContentsAsString());
  }
}

this.TemplateCompiler = TemplateCompiler;
