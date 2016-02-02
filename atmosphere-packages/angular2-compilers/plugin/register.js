'use strict';

Plugin.registerCompiler({
  extensions: ['html']
}, () => new HtmlCompiler());

Plugin.registerCompiler({
  extensions: ['ts'],
  filenames: ['tsconfig.json']
}, () => new TsCompiler());