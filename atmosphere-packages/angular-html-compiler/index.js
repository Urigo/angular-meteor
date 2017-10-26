const $ = Npm.require('cheerio');

const IS_AOT = ((process.env.NODE_ENV == 'production') || process.env.AOT);

const CACHE = new Map();

export class AngularHtmlCompiler {
  compileFile(filePath){
    return CACHE.get(filePath);
  }
  processFilesForTarget(htmlFiles){
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
          });

          htmlFile.addHtml({
            data:  $body.html() || '',
            section: 'body',
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
        }else if(!IS_AOT){
          htmlFile.addAsset({
            data,
            path: htmlFile.getPathInPackage()
          });
        }
      }
    }
  }
}
