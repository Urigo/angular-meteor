NgCompiler = class NgCompiler {
  processFilesForTarget(files) {
    // This mixin is required in order to extend the File object that Meteor provides
    // The FileMixin adds methods that make the work with the files much simpler
    files.forEach((file) => Object.assign(file, FileMixin));
  }
};