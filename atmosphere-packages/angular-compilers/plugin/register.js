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

Plugin.registerCompiler({
  extensions: ['ts', 'tsx'],
  filenames: ['tsconfig.json']
}, () => new AngularTsCompiler());
Plugin.registerCompiler({
  extensions: [templateExtension]
}, () => new AngularHtmlCompiler());
Plugin.registerCompiler({
  extensions: ['scss']
}, () => new AngularScssCompiler());
