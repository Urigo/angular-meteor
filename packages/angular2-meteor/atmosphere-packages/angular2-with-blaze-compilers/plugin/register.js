'use strict';

Plugin.registerCompiler({
  extensions: ['ng2.html']
}, () => new HtmlCompiler());

Plugin.registerCompiler({
  extensions: ['less']
}, () => new StyleCompiler());
