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
