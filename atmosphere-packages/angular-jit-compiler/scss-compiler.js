const sass = Npm.require('node-sass');

const path = Npm.require('path');

const basePath = process.cwd();

export class AngularJitScssCompiler{
  processFilesForTarget(scssFiles){
    try{
      for(const scssFile of scssFiles){
        const fileName = scssFile.getBasename();
        const filePath = scssFile.getPathInPackage();
        if(!fileName.startsWith('_' ) &&
           !filePath.includes('node_modules')){
          const inputData = scssFile.getContentsAsString();
          const fullPath = path.join(basePath, filePath);
          const outputData  = sass.renderSync({
            file: fullPath,
            data: inputData,
            includePaths: [basePath + '/node_modules']
          });
          scssFile.addAsset({
            path: scssFile.getPathInPackage(),
            data: outputData.css.toString('utf-8'),
            sourceMap: outputData.map
          });
        }
      }
    }catch(e){
      scssFile.error(e);
    }
  }
}
