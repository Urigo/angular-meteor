'use strict';

import {
  AngularAotCompiler
} from 'meteor/ardatan:angular-aot-compiler';

import {
  AngularJitTsCompiler,
  AngularJitHtmlCompiler,
  AngularJitScssCompiler
} from 'meteor/ardatan:angular-jit-compiler';

let scriptExtension = 'ts';
let templateExtension = 'html';
let styleExtension = 'scss';

const IS_AOT = (process.env.NODE_ENV == 'production') || process.env.AOT;

if(process.env.BLAZE){
  templateExtension = 'ng.html';
}

if(IS_AOT){
  Plugin.registerCompiler({
    extensions: [scriptExtension, templateExtension, styleExtension],
    filenames: ['tsconfig.json']
  }, () => new AngularAotCompiler());
}else{
    Plugin.registerCompiler({
      extensions: [scriptExtension],
      filenames: ['tsconfig.json']
    }, () => new AngularJitTsCompiler());
    Plugin.registerCompiler({
      extensions: [templateExtension]
    }, () => new AngularJitHtmlCompiler());
    Plugin.registerCompiler({
      extensions: [styleExtension]
    }, () => new AngularJitScssCompiler());
}
