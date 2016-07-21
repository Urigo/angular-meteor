import {
  MainHtmlCompiler, // body, head
  TemplateHtmlCompiler, // templates
  StaticHtmlCompiler,
  utils,
} from 'meteor/urigo:static-html-compiler';

class AngularTemplatesCompiler extends TemplateHtmlCompiler {
  urlContent(file, result) {
    // XXX Why Meteor.isServer?
    // Because if template is not lazy loaded
    // then it's also included on a server side and there is no `angular`.
    //
    // XXX Why `/` before the url?
    // User expects `/client/index.html` instead of `client/index.html`.
    //
    // XXX Why module.exports = {}?
    // Meteor somehow adds a module with `!raw` suffix inside of this module.
    // The ddition looks like this:
    // module.exports = require("./path/to/template.html!raw");
    // So we have to overwrite this.
    //
    // XXX Why exports.__esModule = true ?
    // Meteor specific property.
    // If sets to `true` then whole object is exported directly
    // instead of using `{ default: obj }`
    // This way the default export works the same way in JS and TS.
    return `
      if (Meteor.isServer) return;

      var templateUrl = "/${file.getTemplateUrl()}";
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
    const isPackage = !!file.getPackageName();

    // import template from './path.html';
    file.addJavaScript({
      path: path + '!raw',
      sourcePath: path + '!raw',
      data: this.htmlContent(file, result),
      lazy: true,
    });

    // import templateUrl from './path.html';
    file.addJavaScript({
      path,
      sourcePath: path,
      data: this.urlContent(file, result),
      lazy: isPackage ? false : true,
    });
  }
}

Plugin.registerCompiler({
  extensions: ['html']
}, () => new StaticHtmlCompiler(new MainHtmlCompiler, new AngularTemplatesCompiler));
