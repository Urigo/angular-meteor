# Meteor-Angular2
Angular2 + Meteor integration.

##### Angular2 version: alpha-37.

## Quick start

### Install package:
    meteor add urigo:angular2-meteor

### Import Angular2 into your app:
Package supports TypeScript and Babel (.jsx extension) as languages for development with Angular2.

Angular2 template files go in  ````ng.html```` extension files, same as in [angular-meteor](https://github.com/Urigo/angular-meteor) package.

ES6 modules are supported via SystemJS module loader library.

To start, create ````app.ts```` file, import ````Component```` and ````View```` and then bootstrap the app:
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
Add ````index.html```` file with the folowing content:
````html
    <body>
        <script>System.import('client/app');</script>
    </body>
````

### Start using Meteor in your Angular2 app:
This packages comes with some modules that makes it easy to use Meteor in Angular2.
To load that modules, you will need to bootsrap your app with the help of the package's bootstraper.

To do that, import ````bootstrap```` from Meteor-Angular2 package and remove previous one imported from ````angular2/angular2````:

````ts
    import {bootstrap} from 'angular2-meteor';
    
    ....
    
    bootstrap(Socially);
````

After that, you can use Meteor collections in the same way as you would do in a regular Meteor app with Blaze.

For example, change ````client/app.ts```` to:
````ts
    ....
    
    @View({
      templateUrl: 'client/app.ng.html'
    })
    class Socially {
        constructor() {
          this.parties = Parties.find();
        }
    }
    
    ....
````

Add Angular2 template file ````app.ng.html```` with the following content:
````html
    <div *ng-for="#party of parties">
      <p>Name: {{party.name}}</p>
    </div>
````

At this moment, you are ready to create awesome apps powered by Angular2 and Meteor!

There is few details left though.
For more information, please look at Parties demo app.

#TypeScript Compilation
This package has built-in TypeScript compiler plugin, that is not only compile ````ts```` files, but also provides (by default) diagnostics of that compilation to the terminal (e.g. syntactics, semantics errors). So, if you have code like this:
````ts
    var parties = new Mongo.Collection('parties');
````
It will likely curse that ````Mongo```` is undefined. Luckily, packages adds Angular2 and Meteor declaration file, which means you'll need only to reference it in your TypeScript files to fix errors. 

When you first run your app, Angular2-Meteor will create a declarations (or typings) file ````typings/angular2-meteor.d.ts```` in your app folder . Add reference to it (relatively to top folder) in every TypeScript file you have created, for example:
````ts
/// <reference path="../typings/angular2-meteor.d.ts" />
````

Note: if you just loaded your app from a repository into empty folder and is running it first time, you'll need to re-start it in order to have all package declaration files in place.






