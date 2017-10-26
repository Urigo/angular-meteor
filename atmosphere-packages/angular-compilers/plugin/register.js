'use strict';

import {
  AngularTsCompiler
} from 'meteor/ardatan:angular-ts-compiler';

import {
  AngularHtmlCompiler
} from 'meteor/ardatan:angular-html-compiler';

import {
  AngularScssCompiler
} from 'meteor/ardatan:angular-scss-compiler';

let scriptExtension = 'ts';
let templateExtension = 'html';
let styleExtension = 'scss';

if(process.env.BLAZE){
  templateExtension = 'ng.html';
}

const IS_AOT = ((process.env.NODE_ENV == 'production') || process.env.AOT);

Plugin.registerCompiler({
  extensions: [scriptExtension],
  filenames: ['tsconfig.json']
}, () => new AngularTsCompiler());
Plugin.registerCompiler({
  extensions: [templateExtension]
}, () => new AngularHtmlCompiler());
Plugin.registerCompiler({
  extensions: [styleExtension]
}, () => new AngularScssCompiler());
