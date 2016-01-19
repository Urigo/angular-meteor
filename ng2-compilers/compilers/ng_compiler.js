'use strict';

NgCompiler = class NgCompiler {
  processFilesForTarget(files) {
    files.forEach((file) => mixin(file, FileMixin));
  }
};