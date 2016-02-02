NgCachingCompiler = class NgCachingCompiler extends CachingCompiler {
  constructor(compilerName) {
    super({
      compilerName: compilerName,
      defaultCacheSize: 1024 * 1024 * 10
    });
  }

  getCacheKey(file) {
    return file.getSourceHash();
  }

  processFilesForTarget(files) {
    // This mixin is required in order to extend the File object that Meteor provides
    // The FileMixin adds methods that make the work with the files much simpler
    files.forEach((file) => Object.assign(file, FileMixin));
    super.processFilesForTarget(files);
  }
};
