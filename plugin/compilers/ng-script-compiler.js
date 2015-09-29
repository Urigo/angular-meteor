var ngAnnotate = Npm.require('ng-annotate');

class NgScriptCompiler extends Compiler {
  constructor() {
    super('ng-script-compiler');
    this.fileType = 'JavaScript';
  }

  compileOneFile(file) {
    var annotated = ngAnnotate(file.getContentsAsString(), {
      add: true
    });

    if (annotated.errors) {
      throw new Error(annotated.errors.join(': '));
    }

    return annotated.src;
  }
}

this.NgScriptCompiler = NgScriptCompiler;
