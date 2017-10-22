import fs from 'fs';
import path from 'path';

// using: regex, capture groups, and capture group variables.
const TEMPLATE_URL_REGEX = /templateUrl\s*:(\s*['"`](.*?)['"`]\s*([,}]))/gm;
const STYLES_URLS_REGEX = /styleUrls *:(\s*\[[^\]]*?\])/g;
const STRING_REGEX = /(['`"])((?:[^\\]\\\1|.)*?)\1/g;

const basePath = process.cwd();

export class AngularJitTsCompiler extends TypeScriptCompiler {
  processFilesForTarget(tsFiles){
    for(const tsFile of tsFiles){
      const tsFilePath = tsFile.getPathInPackage();
      if(tsFilePath.endsWith('.d.ts')){
        const jsFilePath = tsFilePath.replace('.d.ts', '.js');
        try{
          const source = fs.readFileSync(path.join(basePath, jsFilePath), 'utf8');
          const result = Babel.compile(source);
          tsFile.addJavaScript({
            path: jsFilePath,
            data: result.code
          })
        }catch(e){}
      }
      this.fixTemplateAndStyleUrls(tsFile);
    }
    super.processFilesForTarget(tsFiles)
  }
    replaceStringsWithFullUrls(basePath, urls){
        return urls
        .replace(STRING_REGEX,
          (match, quote, url) => `'${path.join(basePath, url)}'`);
    }
    fixTemplateAndStyleUrls(tsFile){

      const basePath = tsFile.getPathInPackage().replace(tsFile.getBasename(), '');
      const source = tsFile.getContentsAsString();

      const newSource = source
       .replace(TEMPLATE_URL_REGEX,
        (match, url) => `templateUrl:${this.replaceStringsWithFullUrls(basePath, url)}`)
       .replace(STYLES_URLS_REGEX,
         (match, urls) => `styleUrls:${this.replaceStringsWithFullUrls(basePath, urls)}`);

      tsFile.getContentsAsString = () => newSource;

    }
}
