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

if(process.env.BLAZE){
  templateExtension = 'ng.html';
}

if(process.env.AOT){
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
