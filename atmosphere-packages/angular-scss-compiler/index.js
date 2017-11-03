const sass = Npm.require('node-sass');

const path = Npm.require('path');

const basePath = process.cwd();

const WEB_ARCH_REGEX = /^web/;

const IS_AOT = ((process.env.NODE_ENV == 'production') || process.env.AOT);

const CACHE = new Map();

export class AngularScssCompiler{
  compileFile(filePath, inputData, clearCache){
    const fullPath = path.join(basePath, filePath);
    if(CACHE.has(fullPath) && !clearCache){
      return CACHE.get(fullPath);
    }
    const toBeRendered = {
      file: fullPath,
      includePaths: [basePath + '/node_modules']
    }
    if(inputData){
      toBeRendered.data = inputData;
    }
    const result = sass.renderSync(toBeRendered);
    CACHE.set(fullPath, result);
    return result;
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
          const inputData = scssFile.getContentsAsString();
          const outputData  = this.compileFile(filePath, inputData, true);
          if(!IS_AOT){
            scssFile.addAsset({
              path: filePath,
              data: outputData.css.toString('utf-8'),
              sourceMap: outputData.map
            });
          }
        }
      }catch(e){
        scssFile.error(e);
      }
    }
    console.timeEnd(`[${prefix}]: SCSS Files Compilation`);
  }
}
