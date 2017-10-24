import './dependencies';
import { AngularAotTsCompiler } from './ts-compiler';
import { AngularAotHtmlCompiler } from './html-compiler';

import fs from 'fs';
import path from 'path';

const basePath = process.cwd();

const HTML_REGEX = /\.html$/;
const D_TS_REGEX = /\.d\.ts$/;

export class AngularAotCompiler {
  constructor(extraTsOptions){
    this.tsCompiler = new AngularAotTsCompiler(extraTsOptions);
    this.htmlCompiler = new AngularAotHtmlCompiler();
    this.babelCompiler = new BabelCompiler();
  }
  processFilesForTarget(inputFiles){
    const inputFilePaths = inputFiles
    .map(inputFile => inputFile.getPathInPackage());
    const extraTsFiles = [];
    for(const inputFile of inputFiles){
      const filePath = inputFile.getPathInPackage();
      inputFile._addJavaScript = inputFile.addJavaScript;
      inputFile.addJavaScript = toBeAdded => {
        const path = toBeAdded.path;
        toBeAdded =
          this.babelCompiler.processOneFileForTarget(inputFile, toBeAdded.data);
        toBeAdded.path = path;
        return inputFile._addJavaScript(toBeAdded);
      }
      if(HTML_REGEX.test(filePath)){
        this.htmlCompiler.processOneFileForTarget(inputFile);
      }else if(D_TS_REGEX.test(filePath)){
        const tsFilePath = filePath.replace('.d', '');
        const jsFilePath = filePath.replace('.ts', '.js');
        if(fs.existsSync(jsFilePath)){
          const source = fs.readFileSync(jsFilePath, 'utf8');
          inputFile.addJavaScript({
            path: jsFilePath,
            data: source
          });
        }
      }
    }
    this.tsCompiler.processFilesForTarget(inputFiles, extraTsFiles);
  }
}
