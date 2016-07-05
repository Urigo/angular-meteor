Plugin.registerCompiler({
  extensions: ['less']
}, () => new StyleCompiler());
