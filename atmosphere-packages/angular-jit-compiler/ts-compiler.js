const path = Npm.require('path');

// using: regex, capture groups, and capture group variables.
const TEMPLATE_URL_REGEX = /templateUrl\s*:(\s*['"`](.*?)['"`]\s*([,}]))/gm;
const STYLES_URLS_REGEX = /styleUrls *:(\s*\[[^\]]*?\])/g;
const STRING_REGEX = /(['`"])((?:[^\\]\\\1|.)*?)\1/g;

export class AngularJitTsCompiler extends TypeScriptCompiler {
  processFilesForTarget(tsFiles){
    for(const tsFile of tsFiles){
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
