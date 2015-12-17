'use strict';

JsxCompiler = class JsxCompiler extends NgCachingCompiler {
  constructor() {
    super('jsx-compiler');
  }

  compileResultSize(result) {
    return result.code.length;
  }

  compileOneFile(file) {
    try {
      var extraWhitelist = [
        'es6.modules',
        'es7.decorators'
      ];

      return Babel.transformMeteor(file.getContentsAsString(), {
        sourceMap: true,
        filename: file.getDisplayPath(),
        sourceMapName: file.getDisplayPath(),
        extraWhitelist: extraWhitelist,
        modules: 'system',
        moduleIds: true,
        moduleId: file.getPackagePrefixedModule()
      });
    }
    catch (e) {
      // Other error
      if (!e.loc) throw e;

      // Linting error
      file.error({
        message: e.message,
        sourcePath: file.getPackagePrefixedPath(),
        line: e.loc.line,
        column: e.loc.column
      });
    }
  }

  addCompileResult(file, result) {
    file.addJavaScript({
      data: result.code,
      path: file.getPackagePrefixedModule() + '.js',
      sourceMap: result.map
    });
  }
}
