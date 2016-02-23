## Angular 2 HTML templates compiler for Meteor

This package provides an HTML compiler that required in order to write Angular 2.0 code inside Meteor application.

The HTML compiler is based on two compilers:
* HTML compiler which compiles the main endpoint of your application - that means the only file that contain `<head>` and `<body>` tags.
* Templates compiler - those are HTML files that used as templates, the **must not** contain any `<head>` or `<body>` tags.

### Installing the compiler

In order to use those compilers, you need first to remove the default HTML compiler in Meteor, by running:
```
$ meteor remove  blaze-html-templates
```

This package provides and exports the `HtmlCompiler` object, but it does no register it. 
So to keep it simple and easy to use with Angular 2.0, please install the `angular2-compilers` package which registers this plugin and more plugins that required for Angular 2.0.

To add the Angular 2.0 compilers, run the following command:
```
$ meteor add angular2-compilers
```

If you wish to add this compiler **without** all the other required compilers of Angular 2.0, you need to create your own package, and register this plugin like that:
```js
  Plugin.registerCompiler({
    extensions: ['html']
  }, () => new HtmlCompiler());
```
