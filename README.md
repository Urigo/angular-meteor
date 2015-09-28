# Meteor-Angular2
Angular2 + Meteor integration.

##### Angular2 version: alpha-37.

## Quick start

### Install package:
This package is not published yet. If you want to try it out, please, 
clone it from the current repo into a local folder.

### Import Angular2 into your app:
Package supports TypeScript and Babel (.jsx file extension) as languages for development with Angular2.

ES6 modules are supported via SystemJS module loader library.

To start, create `app.ts` file, import `Component` and `View` and then bootstrap the app:
````ts
    import {Component, View, bootstrap} from 'angular2/angular2';
    
    @Component({
      selector: 'app'
    })
    @View({
      template: "<p>Hello World!</p>"
    })
    class Socially {}
    
    bootstrap(Socially);
````

Add `index.html` file to the app top folder:
````html
    <app></app>
````
At this point you should see app working and showing "Hello word".

Presence of `index.html` is mandatory. Treat it as a starting point of your app,
where you can add `<head></head>` or `<body></body>` with, for example,
script links to load in the head or some required content in the body.

If you added just `<app></app>` without body element (as above), package will create it for you.

Also, if you name your main component `app.ts`, package checks its presence and if it's there it imports this System.js module for you,
otherwise, you'll need to import main module manually by adding next lines to the `index.html`:
````html
<body>
    System.import('client/main_module_file_name');
</body>
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

There is some details left though.
For more information, please look at Parties demo app.

###TypeScript Compilation
This package has built-in TypeScript compiler plugin, that is not only compile `ts` files, but also provides (by default) diagnostics of the compilation to the terminal (e.g. syntactic, semantic errors). So, if you have code like this:
````ts
    var parties = new Mongo.Collection('parties');
````
It will likely curse that `Mongo` is undefined. Luckily, package adds Angular2 and Meteor declaration file, which means you'll need only to reference it in your TypeScript files to fix errors. 

When you first run your app, Angular2-Meteor will create a declarations (or typings) file `typings/angular2-meteor.d.ts` in your app folder . Add reference to it in every TypeScript file you have created or are going to create as follows:
````ts
/// <reference path="../typings/angular2-meteor.d.ts" />
````
Make sure that paths are relative to the app top folder.

> Note: if you just loaded your app from a repository into empty folder and is running it first time, you'll need to re-start it in order to have all package declaration files in place.
