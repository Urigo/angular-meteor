'use strict';

class NgCompiler {
  processFilesForTarget(files) {
    files.forEach((file) => mixin(file, FileMixin));
  }
}

this.NgCompiler = NgCompiler;
