## Angular 2 HTML templates compiler for Meteor

This package exports an HTML processor that processes HTML files as follows:
* Checks whether your app contains a main HTML file(s), i.e. a file with `<head>` and `<body>` tags.
  If there are mutiple of them, it combines them together;
* HTML files that don't contain `<head>` or `<body>` tags are treated as resources, i.e. they are
  become available on the server as static resources (i.e., added with `Meteor.addAsset`);
* Adds two Node JS-modules for each template's HTML content and template URL, so user can import them in ES6 style:
  `import contentUrl from './foo.html'`, `import content from './foo.html!raw'`.

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
