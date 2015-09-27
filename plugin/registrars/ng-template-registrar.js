Utils.registerCompiler('html', (files) => {
  var appFiles = _.filter(files, Utils.isClient);
  var otherFiles = _.reject(files, Utils.isClient);
  new NgTemplateCompiler().processFilesForTarget(appFiles);
  new TemplateCompiler().processFilesForTarget(otherFiles);
});