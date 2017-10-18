import { AngularAotTsCompiler } from './ts-compiler';
import { AngularAotHtmlCompiler } from './html-compiler';

const HTML_REGEX = /\.html$/;
const TS_REGEX = /\.ts$/;

export class AngularAotCompiler {
  constructor(extraTsOptions){
    this.tsCompiler = new AngularAotTsCompiler(extraTsOptions);
    this.htmlCompiler = new AngularAotHtmlCompiler();
  }
  processFilesForTarget(inputFiles){
    for(const inputFile of inputFiles){
      const fileName = inputFile.getBasename();
      if(HTML_REGEX.test(fileName)){
        this.htmlCompiler.processFileForTarget(inputFile);
      }else if(TS_REGEX.test(fileName)){
        this.tsCompiler.fixTemplateAndStyleUrls(inputFile);
      }
    }
    this.tsCompiler.processFilesForTarget(inputFiles);
  }
}
