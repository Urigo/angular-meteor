
/**
 * Contains addCompileResult that decides 
 * how current compiled styles should be exposed outside:
 * whether they will be just bundled together with other styles,
 * or will be available as static assets on the server as well.
 */
BasicCompiler = class BasicCompiler {
  addCompileResult(inputFile, result) {
    const ex = inputFile.getExtension();
    const path = inputFile.getPathInPackage();
    const cssPath = ex !== 'css' ? path + '.css' : path;

    if (!cssPath.startsWith('imports')) {
      inputFile.addStylesheet({
        data: result.css,
        path: cssPath,
        sourceMap: result.sourceMap
      });
      return;
    }

    // CSS files that comes from `imports` folder
    // can be downloaded as server assets.
    inputFile.addAsset({
      data: result.css,
      path: cssPath
    });

    // Export current template as a JS-module, which
    // means constructions as follows now make sense:
    //   import style from 'path/to/style.css'
    //
    // JS-module is being added as 'lazy', which
    // means it'll appear on the client only if it's
    // explicitly imported somewhere in the code base.
    let css = Babel.compile(`
      const css = \`${result.css}\`;
      exports.default = css;`
    );

    inputFile.addJavaScript({
      data: css.code,
      path: cssPath,
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
