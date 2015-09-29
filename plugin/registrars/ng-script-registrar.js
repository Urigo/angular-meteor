Utils.registerCompiler('js', (files) => {
  var appFiles = _.filter(files, Utils.isClient);
  var otherFiles = _.reject(files, Utils.isClient);
  new NgScriptCompiler().processFilesForTarget(appFiles);
  new ScriptCompiler().processFilesForTarget(otherFiles);
});