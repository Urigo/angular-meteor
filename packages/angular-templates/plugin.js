import {
  MainHtmlCompiler, // body, head
  TemplateHtmlCompiler, // templates
  StaticHtmlCompiler,
  utils,
} from 'meteor/urigo:static-html-compiler';

class AngularTemplatesCompiler extends TemplateHtmlCompiler {
  urlContent(file, result) {
    return `
      var templateUrl = "${file.getPathInPackage()}";
      var template = "${utils.clean(result)}";

      angular.module('angular-templates')
        .run(['$templateCache', function($templateCache) {
          $templateCache.put(templateUrl, template);
        }]);

      module.exports = {};
      module.exports.__esModule = true;
      module.exports.default = templateUrl;
    `;
  }

  htmlContent(file, result) {
    return `
      exports.__esModule = true;
      exports.default = "${utils.clean(result)}";
    `;
  }

  addCompileResult(file, result) {
    const path = file.getPathInPackage();

    // import template from './path.html';
    file.addJavaScript({
      path: path + '!raw',
      data: this.htmlContent(file, result),
      lazy: true,
    });

    // import templateUrl from './path.html';
    file.addJavaScript({
      path,
      data: this.urlContent(file, result),
      lazy: true,
    });
  }
}

Plugin.registerCompiler({
  extensions: ['html']
}, () => new StaticHtmlCompiler(new MainHtmlCompiler, new AngularTemplatesCompiler));
