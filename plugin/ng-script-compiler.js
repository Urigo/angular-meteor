var ngAnnotate = Npm.require('ng-annotate');

function NgScriptCompiler() {
  SimpleCachingCompiler.apply(this, arguments);
}

NgScriptCompiler.prototype = Object.create(SimpleCachingCompiler.prototype);
NgScriptCompiler.prototype.constructor = NgScriptCompiler;

NgScriptCompiler.prototype.compileOneFile = function(file) {
  var annotated = ngAnnotate(file.getContentsAsString(), {
    add: true
  });

  if (annotated.errors) {
    throw new Error(annotated.errors.join(': '));
  }

  return annotated.src;
};

NgScriptCompiler.prototype.addOneFile = function(file) {
  return {
    type: 'JavaScript',
    path: file.getPathInPackage()
  };
};

Plugin.registerCompiler({
  extensions: ['js']
}, function() {
  return new NgScriptCompiler();
});
