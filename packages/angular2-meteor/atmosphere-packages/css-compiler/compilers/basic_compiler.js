const jsStringEscape = Npm.require('js-string-escape');

/**
 * Contains addCompileResult that decides 
 * how current compiled styles should be exposed outside:
 * whether they will be just bundled together with other styles,
 * or will be available as static assets on the server as well.
 */
BasicCompiler = class BasicCompiler {
  addCompileResult(inputFile, result) {
    const ex = inputFile.getExtension();
    const sourcePath = inputFile.getPathInPackage();
    const targetPath = ex !== 'css' ? sourcePath + '.css' : sourcePath;
 
  // Combine all styles from other than imports folders.
    if (sourcePath.indexOf('imports') === -1) {
      inputFile.addStylesheet({
        data: result.css,
        path: targetPath,
        sourceMap: result.sourceMap
      });
      return;
    }

    let resultCss = result.css;
    if (!Meteor.isDevelopment) {
      resultCss = CssTools.minifyCss(result.css)[0];
    }

    // CSS files that comes from `imports` folder
    // can be downloaded as server assets.
    inputFile.addAsset({
      data: resultCss,
      path: sourcePath
    });

    // Export URL of the template as a JS-module, which
    // means imports as follows now make sense:
    //   import styleUrl from 'path/to/style.css!url'
    let urlCode = `
      var url = '/${sourcePath}?hash=${inputFile.getSourceHash()}';
      exports.default = url;`;
    const urlPath = sourcePath + '!url';      
    inputFile.addJavaScript({
      data: urlCode,
      path: urlPath
    });

    // Export current template as a JS-module, which
    // means imports as follows now make sense:
    //   import style from 'path/to/style.css'
    //
    // JS-module is being added as 'lazy', i.e.
    // it'll appear on the client only if it's
    // explicitly imported somewhere in the code base.
    let css = Babel.compile('const css = "' + jsStringEscape(resultCss) + '"; module.exports.default = css;');
    inputFile.addJavaScript({
      data: css.code,
      path: sourcePath,
      lazy: true
    });
  }
};

classMixin = function(target, source) {
  target = target.prototype; source = source.prototype;

  Object.getOwnPropertyNames(source).forEach(name => {
    if (name !== 'constructor') {
      Object.defineProperty(target, name,
        Object.getOwnPropertyDescriptor(source, name));
    }
 });
};
