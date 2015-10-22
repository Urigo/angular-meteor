# Meteor-Angular2
Angular2 + Meteor integration.

##### Angular2 version: alpha-42.

## Quick start

### Install package:
````
    meteor add urigo:angular2-meteor
````

### Import Angular2 into your app:
Package supports TypeScript and Babel (.jsx file extension) as languages for development with Angular2.

ES6 modules are supported via SystemJS module loader library.

To start, create `app.ts` file, import `Component` and `View` and then bootstrap the app:
````ts
    import {Component, View, bootstrap} from 'angular2/angular2';

    @Component({
      selector: 'socially'
    })
    @View({
      template: "<p>Hello World!</p>"
    })
    class Socially {}

    bootstrap(Socially);
````

Add `index.html` file to the app top folder:
````html
    <body>
       <socially></socially>
    </body>
````
At this point you should see app working and showing "Hello word".

If you have an HTML file in the app root folder with `body` or `head` tag (`index.html` in our case), the package will recognize it as your master HTML file and will skip inserting a default layout. Otherwise, it'll insert bootstrap HTML as follows:
````html
<body>
    <app></app>
</body>
````
Also, if you name your main client component `app.ts`, the package will import `client/app` System.js module for you.

You can name the component whatever you want, but when doing so you'll need to import it manually by adding the next script in the `index.html` or some JS file (say, `main.js`):
````js
Meteor.startup(() => {
    System.import('client/foo');
});
````

### Start using Meteor in your Angular2 app:
This package comes with some modules that makes it easy to use Meteor in Angular2.
To load that modules, you will need to bootsrap your app with the help of the package's bootstraper.

To do that, import `bootstrap` from Meteor-Angular2 package and remove previous one imported from `angular2/angular2`:

````ts
    import {bootstrap} from 'angular2-meteor';

    ....

    bootstrap(Socially);
````

After that, you can use Meteor collections in the same way as you would do in a regular Meteor app with Blaze.

For example, change `client/app.ts` to:
````ts
    ....

    @View({
      templateUrl: 'client/parties.html'
    })
    class Socially {
        constructor() {
          this.parties = Parties.find();
        }
    }

    ....
````

Add Angular2 template file `client/parties.html` with a content as follows:
````html
    <div *ng-for="#party of parties">
      <p>Name: {{party.name}}</p>
    </div>
````

At this moment, you are ready to create awesome apps backed by the power of Angular2 and Meteor!

There are some details left though.
For more information, please check Parties demo app.

### Server Side
You can import TypeScript and System.js on the server side same way you can on the client side.

Similar to the client's main module `app.ts`, the package checks for the existence of the `main.ts` file in the server folder and, in case of success, will import it for you. Otherwise, you can name main module as you want and import by:
````ts
Meteor.startup(() => {
    System.import('server/foo').await();
))
````

### TypeScript Compilation
The package uses this TypeScript [compilers](https://github.com/barbatus/ts-compilers) to compile `.ts`-files. Please, read there how you can configure TypeScript, what options are available or how you can speed up just-in-time compilation.

By default, compiler will curse on syntactic errors and will log out all missing modules and other semantic errors to the terminal.
So, if you have code like this:
````ts
    var parties = new Mongo.Collection('parties');
````
It will likely curse that `Mongo` is undefined. Luckily, package adds Angular2 and Meteor declaration file, which means you'll need only to reference it in your TypeScript files to fix errors.

When you first run your app, Angular2-Meteor will create a declarations (or typings) file `typings/angular2-meteor.d.ts` in your app folder . Add references to it in every TypeScript file you have created or are going to create as follows:
````ts
/// <reference path="../typings/angular2-meteor.d.ts" />
````
Make sure that paths are relative to the app top folder.

> Note: if you just loaded your app from a repository into an empty folder and you're running it for the first time, you'll need to re-start it in order to have all package declaration files in place.
