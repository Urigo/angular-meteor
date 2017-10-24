import fs from 'fs';
import path from 'path';

// using: regex, capture groups, and capture group variables.
const TEMPLATE_URL_REGEX = /templateUrl\s*:(\s*['"`](.*?)['"`]\s*([,}]))/gm;
const STYLES_URLS_REGEX = /styleUrls *:(\s*\[[^\]]*?\])/g;
const LOAD_CHILDREN_REGEX = /loadChildren\s*:(\s*['"`](.*?)['"`]\s*([,}]))/gm;
const STRING_REGEX = /(['`"])((?:[^\\]\\\1|.)*?)\1/g;

const basePath = process.cwd();

export class AngularJitTsCompiler extends TypeScriptCompiler {
  constructor(...extraOptions){
    super(...extraOptions);
    this.babelCompiler = new BabelCompiler();
  }
  processFilesForTarget(tsFiles){
    for(const tsFile of tsFiles){
      const prefix = tsFile.getArch().includes('web') ? 'client' : 'server';
      const tsFilePath = tsFile.getPathInPackage();
      if(tsFilePath.endsWith('.d.ts')){
        const jsFilePath = tsFilePath.replace('.d.ts', '.js');
        if(fs.existsSync(jsFilePath)){
          const source = fs.readFileSync(path.join(basePath, jsFilePath), 'utf8');
          const toBeAdded = this.babelCompiler.processOneFileForTarget(inputFile, source);
          toBeAdded.path = jsFilePath;
          tsFile.addJavaScript(toBeAdded);
        }
      }
      this.fixResourceUrls(tsFile);
    }
    super.processFilesForTarget(tsFiles);
  }
  replaceStringsWithFullUrls(basePath, urls){
      return urls
      .replace(STRING_REGEX,
        (match, quote, url) => `'/${path.join(basePath, url)}'`);
  }
    fixResourceUrls(tsFile){

      const basePath = tsFile.getPathInPackage().replace(tsFile.getBasename(), '');
      const source = tsFile.getContentsAsString();

      let fakeLoaderCode = '';

      const newSource = source
      .replace(TEMPLATE_URL_REGEX,
        (match, url) => `templateUrl:${this.replaceStringsWithFullUrls(basePath, url)}`)
      .replace(STYLES_URLS_REGEX,
         (match, urls) => `styleUrls:${this.replaceStringsWithFullUrls(basePath, urls)}`)
      .replace(LOAD_CHILDREN_REGEX,
        (match, url) => {
          const replaced = this.replaceStringsWithFullUrls(basePath, url).trim();
          const fixedUrl = (replaced
                              .split('#')[0]) + replaced[0];

          fakeLoaderCode += `function fakeLoader(){module.dynamicImport(${fixedUrl})}`;
          return `loadChildren: ${replaced}`;
        })


      tsFile.getContentsAsString = () => newSource;
      tsFile.origAddJavaScript = tsFile.addJavaScript;
      tsFile.addJavaScript = options => {
        if(fakeLoaderCode)
          options.data = fakeLoaderCode + '\n' + options.data;
        return tsFile.origAddJavaScript(options);
      };
    }
}
