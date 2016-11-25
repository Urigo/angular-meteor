/**
 * Contains addCompileResult that decides 
 * how current compiled styles should be exposed outside:
 * whether they will be just bundled together with other styles,
 * or will be available as static assets on the server as well.
 */
BasicCompiler = class BasicCompiler {
  addCompileResult(inputFile, result) {
    const ext = inputFile.getExtension();
    const sourcePath = inputFile.getPathInPackage();
    const targetPath = ext !== 'css' ? sourcePath + '.css' : sourcePath;
 
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
    if (! Meteor.isDevelopment) {
      resultCss = CssTools.minifyCss(resultCss)[0];
    }

    // CSS files that comes from `imports` folder
    // can be downloaded as server assets.
    inputFile.addAsset({
      data: resultCss || '',
      path: sourcePath
    });

    if (this.customAddCompileResult) {
      this.customAddCompileResult(inputFile, result);
    }
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
