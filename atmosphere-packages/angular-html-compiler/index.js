const $ = Npm.require('cheerio');

const WEB_ARCH_REGEX = /^web/;

const CACHE = new Map();

export class AngularHtmlCompiler {
  constructor({aot}){
    this.isAot = aot;
  }
  static getContent(filePath){
    return CACHE.get(filePath);
  }
  processFilesForTarget(htmlFiles){
    const arch = htmlFiles[0].getArch();
    const forWeb = WEB_ARCH_REGEX.test(arch);
    const prefix = forWeb ? 'client' : 'server';
    console.time(`[${prefix}]: HTML Files Compilation`);
    for(const htmlFile of htmlFiles){
      if(!htmlFile.getPathInPackage().includes('node_modules')){
        const data = htmlFile.getContentsAsString();
        CACHE.set(htmlFile.getPathInPackage(), data);
        const $contents = $(data);
        const isMain = $contents.closest('head,body').length;
        if(isMain){
          const $head = $contents.closest('head');
          const $body = $contents.closest('body');
          htmlFile.addHtml({
            data: $head.html() || '',
            section: 'head',
            hash: htmlFile.getSourceHash()
          });

          htmlFile.addHtml({
            data:  $body.html() || '',
            section: 'body',
            hash: htmlFile.getSourceHash()
          });
          const attrs = $body[0] ? $body[0].attribs : undefined;
          if (attrs) {
            htmlFile.addJavaScript({
              path: 'main.html.js',
              data: `
                Meteor.startup(function() {
                  var attrs = ${JSON.stringify(attrs)};
                  for (var prop in attrs) {
                    document.body.setAttribute(prop, attrs[prop]);
                  }
                });
              `,
            });
          }
        }else if(!this.isAot){
          htmlFile.addAsset({
            data,
            path: htmlFile.getPathInPackage(),
            hash: htmlFile.getSourceHash()
          });
        }
      }
    }
    console.timeEnd(`[${prefix}]: HTML Files Compilation`);
  }
}
