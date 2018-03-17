const sass = Npm.require('node-sass');

const path = Npm.require('path');

const basePath = process.cwd();

const WEB_ARCH_REGEX = /^web/;

const IS_AOT = ((process.env.NODE_ENV == 'production') || process.env.AOT);

const CACHE = new Map();

export class AngularScssCompiler{
  static getContent(filePath){
    return CACHE.get(filePath);
  }
  static compileFile(filePath, data){
    const fullPath = filePath.includes(basePath) ? filePath : path.join(basePath, filePath);
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
          }else if(!IS_AOT){
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
