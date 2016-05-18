'use strict';

Plugin.registerCompiler({
  extensions: ['html']
}, () => new HtmlCompiler());

Plugin.registerCompiler({
  extensions: ['less']
}, () => new StyleCompiler());
