function SimpleCachingCompiler() {
  CachingCompiler.call(this, {
    compilerName: this.constructor.name,
    defaultCacheSize: 1024 * 1024 * 10
  });
}

SimpleCachingCompiler.prototype = Object.create(CachingCompiler.prototype);
SimpleCachingCompiler.prototype.constructor = SimpleCachingCompiler;

SimpleCachingCompiler.prototype.getCacheKey = function(file) {
  return file.getSourceHash();
};

SimpleCachingCompiler.prototype.compileResultSize = function(result) {
  return result.length;
};

SimpleCachingCompiler.prototype.addCompileResult = function(file, result) {
  if (!result) return;

  var fileDescription = this.addOneFile(file);
  var fileType = fileDescription.type;
  fileDescription.data = result;
  delete fileDescription.type;

  file['add' + fileType](fileDescription);
};