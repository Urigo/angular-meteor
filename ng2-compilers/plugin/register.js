'use strict';

Plugin.registerCompiler({
  extensions: ['html']
}, () => new HtmlCompiler('<app></app>'));

Plugin.registerCompiler({
  extensions: ['ts'],
  filenames: ['tsconfig.json']
}, () => new TsCompiler());