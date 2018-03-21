const sass = Npm.require('node-sass');

const path = Npm.require('path');

import {
  basePath,
  ROOTED,
  getMeteorPath,
  isRooted,
  getNoRooted
} from './file-utils';

const WEB_ARCH_REGEX = /^web/;

const CACHE = new Map();

export class AngularScssCompiler{
  constructor({
    aot
  }){
    this.isAot = aot;
  }
  static getContent(filePath){
    return CACHE.get(filePath);
  }
  static compileFile(filePath, data){
    const fullPath = isRooted(filePath) ? filePath : path.join(basePath, filePath);
    return sass.renderSync({
      file: fullPath,
      includePaths: [basePath + '/node_modules'],
      data
    });
  }
  processFilesForTarget(scssFiles){
    const arch = scssFiles[0].getArch();
    const forWeb = WEB_ARCH_REGEX.test(arch);
    const prefix = forWeb ? 'client' : 'server';
    console.time(`[${prefix}]: SCSS Files Compilation`);
    for(const scssFile of scssFiles){
      try{
        const fileName = scssFile.getBasename();
        const filePath = scssFile.getPathInPackage();
        if(!fileName.startsWith('_' ) &&
           !filePath.includes('node_modules')){
          const outputData = AngularScssCompiler.compileFile(filePath, scssFile.getContentsAsString());
          CACHE.set(filePath, outputData.css.toString('utf-8'));
          const toBeAdded = {
            path: filePath,
            data: outputData.css.toString('utf-8'),
            sourceMap: outputData.map,
            hash: outputData.hash
          };
          if(!filePath.includes('imports/')){
            scssFile.addStylesheet(toBeAdded)
          }else if(!this.isAot){
            scssFile.addAsset(toBeAdded);
          }
        }
      }catch(e){
        scssFile.error(e);
        console.error(e);
      }
    }
    console.timeEnd(`[${prefix}]: SCSS Files Compilation`);
  }
}
