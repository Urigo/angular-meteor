'use strict';

import {
  StaticHtmlCompiler,
} from 'meteor/urigo:static-html-compiler';

Plugin.registerCompiler({
  extensions: ['html']
}, () => new StaticHtmlCompiler());

Plugin.registerCompiler({
  extensions: ['less', 'scss', 'sass']
}, () => new StyleCompiler());
