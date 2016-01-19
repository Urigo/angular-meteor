'use strict';

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
    files.forEach((file) => mixin(file, FileMixin));
    super.processFilesForTarget(files);
  }
};
