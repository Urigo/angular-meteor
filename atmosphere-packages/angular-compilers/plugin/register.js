'use strict'; 

import {
  AngularTsCompiler
} from 'meteor/angular-typescript-compiler';

import {
  AngularHtmlCompiler
} from 'meteor/angular-html-compiler';

import {
  AngularScssCompiler
} from 'meteor/angular-scss-compiler';

let templateExtension = 'html';

if(process.env.BLAZE){
  templateExtension = 'ng.html';
}

let aot = ((process.env.NODE_ENV == 'production') && (process.env.AOT != '0')) || process.env.AOT == '1';
let rollup = (process.env.ROLLUP == '1');
let compiler, compilerCli;
try{
  if(aot){
    compiler = require('@angular/compiler');
    compilerCli = require('@angular/compiler-cli');
  }
}catch(e){
  console.log('@angular/compiler and @angular/compiler-cli must be installed for AOT compilation!');
  console.log('AOT compilation disabled!');
  console.log('Ignore this if you are using AngularJS 1.X');
  aot = false;
  rollup = false;
}


Plugin.registerCompiler({
  extensions: ['ts', 'tsx'],
  filenames: ['tsconfig.json']
}, () => new AngularTsCompiler({
  aot,
  rollup,
  compiler,
  compilerCli
}));
Plugin.registerCompiler({
  extensions: [templateExtension]
}, () => new AngularHtmlCompiler({
  aot
}));
Plugin.registerCompiler({
  extensions: ['scss']
}, () => new AngularScssCompiler({
  aot
}));
