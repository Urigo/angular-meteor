const $ = Npm.require('cheerio');

export class AngularJitHtmlCompiler {
  processFilesForTarget(htmlFiles){
    for(const htmlFile of htmlFiles){
      if(!htmlFile.getPathInPackage().includes('node_modules')){
        const data = htmlFile.getContentsAsString();
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
        }else{
          htmlFile.addAsset({
            data,
            path: htmlFile.getPathInPackage()
          });
        }
      }
    }
  }
}
