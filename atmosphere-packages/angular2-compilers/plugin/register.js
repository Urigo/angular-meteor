'use strict';

Plugin.registerCompiler({
  extensions: ['html']
}, () => new HtmlCompiler());
