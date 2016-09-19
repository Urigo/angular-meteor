NgCompiler = class NgCompiler {
  processFilesForTarget(files) {
    files.forEach((file) => Object.assign(file, FileMixin));
  }
};