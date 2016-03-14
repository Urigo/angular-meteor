'use strict';

Plugin.registerCompiler({
  extensions: ['html'],
  archMatching: 'web'
}, () => new HtmlCompiler());
