# Angular2-Meteor [![Build Status](https://travis-ci.org/Urigo/angular2-meteor.svg?branch=feature%2Fmeteor1.3)](https://travis-ci.org/Urigo/angular2-meteor)
Angular2 + Meteor integration.

##### Angular2 version: beta-9.

## Table of Contents
* [Tutorial](../../#tutorial)
* [Quick Start](../../#quick-start)
    * [Install package](../../#install-package)
    * [Import Angular2 into your app](../../#import-angular2-into-your-app)
    * [Start using Meteor in your angular2 app](../../#start-using-meteor-in-your-angular2-app)
* [Demos](../../#demos)
* [Server Side](../../#server-side)
* [TypeScript Support](../../#typescript-support)
* [Roadmap](../../#roadmap)
* [Contribution](../../#contribution)

## Change Log

Check out change log of the package [here](CHANGELOG.md).

## Tutorial

If you are new to Angular 2, we recommend to check out our 15-steps Angular2+Meteor [tutorial](http://www.angular-meteor.com/tutorials/socially/angular2/bootstrapping).

## Quick Start

### Install package:

#### With Meteor 1.3:
````
    npm install angular2-meteor --save
    npm install angular2-meteor-auto-bootstrap --save
````

This package adds own HTML processor and TypeScript support, so you'll also need to remove the standard HTML processor:

````
   meteor remove blaze-html-templates
````

And add Angular2 compilers package:

````
   meteor add barbatus:ng2-compilers
````

For the explanation, please, read "HTML" [paragraph](http://www.angular-meteor.com/tutorials/socially/angular2/bootstrapping) in the above mentioned tutorial.

Notes:
- Meteor 1.3 uses CommonJS implementation for modules loading so you do not need to use SystemJS or any other loader!

#### With Meteor 1.2
````
   meteor add angular2-meteor
````   

Notes:
- The compilers are part of this package.
- Meteor 1.2 does not have modules loader, so you need to use SystemJS as modules loader (comes with this package!)

### Import Angular2 into your app:
Package supports TypeScript and Babel (.jsx file extension) as languages for development with Angular2.

ES6 modules are supported via CommonsJS (starting in Meteor 1.3) module loader library.

To start, create `app.ts` file, import `Component` and `View` and then bootstrap the app:
````ts
    import {Component, View} from 'angular2/core';
    import {bootstrap} from 'angular2/bootstrap';

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

Also, if you name your main client component is `app.ts`, the package will import `client/app` it automatically.

( Note that if you use Meteor 1.2, you need to use SystemJS imports to load your main file!)

### Start using Meteor in your Angular2 app:

This package comes with some modules that makes it easy to use Meteor in Angular2.

You can use Meteor collections in the same way as you would do in a regular Meteor app with Blaze, you just need to use another `bootstrap` method, instead of the one the comes with Angular2:

````js
import {bootstrap} from 'angular2-meteor-auto-bootstrap';
````

And now you can iterate `Mongo.Cursor` objects with Angular 2.0 ngFor!

For example, change `client/app.ts` to:
````ts
    // ....

    @View({
      templateUrl: 'client/parties.html'
    })
    class Socially {
        constructor() {
          this.parties = Parties.find();
        }
    }

    // ....
````

Add Angular2 template file `client/parties.html` with a content as follows:
````html
    <div *ngFor="#party of parties">
      <p>Name: {{party.name}}</p>
    </div>
````

At this moment, you are ready to create awesome apps backed by the power of Angular2 and Meteor!

To use Meteor features, make sure that your components extends `MeteorComponent`, and you can feature that comes from Meteor:

````ts
    import {Component, View} from 'angular2/core';
    import {bootstrap} from 'angular2-meteor-auto-bootstrap';
    import {MeteorComponent} from 'angular2-meteor';
    import {MyCollection} form '../model/my-collection.ts';

    @Component({
      selector: 'socially'
    })
    @View({
      template: "<p>Hello World!</p>"
    })
    class Socially extends MeteorComponent {
      myData : Mongo.Cursor<any>;
    
      constructor() {
         this.myData = MyCollection.find({});
         this.subscribe('my-subscription'); // Wraps Meteor.subscribe
      }
      
      doSomething() {
         this.call('server-method'); // Wraps Meteor.call
      }
    }

    bootstrap(Socially);
````

You can find more examples in the full tutorial!

## Demos

Check out two demos for the quick how-to:

* the Tutorial's [Socially app](https://github.com/Urigo/meteor-angular2.0-socially)
* [Todos](https://github.com/Urigo/Meteor-Angular2/tree/master/examples/todos) demo (deployed http://ng2-todos.meteor.com).

### Server Side
You can use TypeScript also in the server side, so you can share you interfaces with both client and server!

Similar to the client's main module `app` file, Meteor checks for the existence of the `main` file in the server folder and, in case of success, will import it for you.

### TypeScript Support
The package uses this TypeScript [compilers](https://github.com/barbatus/ts-compilers) to compile `.ts`-files. Please, read there how you can configure TypeScript, what options are available or how you can speed up just-in-time compilation.

TypeScript configuration file a.k.a. `tsconfig.json` is supported as well. Place a file with this name at the root folder and start adding any available TypeScript options you want. Read about the structure [here] (https://github.com/Microsoft/TypeScript/wiki/tsconfig.json). "files" property works only for the declaration files in the "typings" folder.

We recommend to use something like this default config file:
````json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "module": "commonjs",
    "target": "es5",
    "isolatedModules": false,
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "removeComments": false,
    "noImplicitAny": false,
    "sourceMap": true
  }
}
````

By default, all modules from `node_modules` are included so you do not need to handle typings when you first create an app.

## Roadmap

You can check out the package's roadmap and its status under this repository's issues.

## Contribution
If you know how to make integration of Angular 2 and Meteor better, you are welcome!

For the coding style guide, we use AirBnB [rules](https://github.com/airbnb/javascript) with TypeScript specifics and max line width set to 100 symbols. Rules are partly enforced by the tslint.json file in the root (if you are not familiar with TSLint, read more [here](https://github.com/palantir/tslint)). Please, check that your code conforms with the rules before PR.

### Clone the source to your computer

In order to work with this package locally when using Meteor 1.3 project, follow these instructions:

1. Clone this repository to any folder. 
   Note that if you clone into Meteor project directory - you need to put the cloned folder inside a hidden file so Meteor     wont try to build it! just create a folder that starts with `.` under your project root, it should look like that:
   ````
   MyProject
      .local-work
         angular2-meteor
      .meteor
      client
      server
      public
   ````

2. Make sure that you already have `node_modules` directory under your root - if not - create it:
   ````
   $ mkdir node_modules
   ````

   Also, make sure that you have a NPM project initialized in your directory (you should have `package.json`), if not, use:
   ````
   $ npm init
   ````

3. Make sure that you do not have angular2-meteor already - check under `node_modules` - if you do, delete it.

4. Now you have two options, you can specify the local copy in the `package.json` of your project, as follow:
   ````json
   {
      "dependencies": {
         "angular2-meteor": "./local-work/angular2-meteor"
      }
   }
   ````

   And then make sure to run the NPM install command:
   ````
   $ npm install
   ````
   
   **Or, ** you can link the directory using NPM command like tool, as follow:
   ```
   $ npm link ./local-work/angular2-meteor
   ```
   
### Building the project from sources

In order to use your local copy of Angular2-Meteor, you have two options:

1. Import the TypeScript source code from the package, for example:

   ````
   import {MeteorComponent} from 'angular2-meteor/modules/meteor_component.ts';
   ````
   
2. Or, you can keep the same code you have now, but you will need to build Angular2-Meteor source code each change you perform, by using the `build.sh` script inside the `node_modules/angular2-meteor` directory. 
The build proccess uses Webpack in order to perform the build, using `ts-loader`, so make sure that you have `webpack` package installed from NPM.

### Troubleshoot

When working with local package, note that you should never have two local packages of `angular2` package, you should have it only under `node_modules/angular2` of the root directory. 
In case of weird errors regarding missing direcrtives - make sure that you do not have a copy of `angular2` package under `node_modules/angular2-meteor/node_modules/angular2`!
