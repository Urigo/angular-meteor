# Angular2-Meteor [![NPM version][npm-version-image]][npm-url] [![NPM downloads][npm-downloads-image]][npm-url] [![Build Status](https://travis-ci.org/Urigo/angular2-meteor.svg?branch=master)](https://travis-ci.org/Urigo/angular2-meteor)
Angular2 + Meteor integration.

##### Angular2 version: beta-12.

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

If you suddenly started facing issues or want to upgrade,
please check out common issues and troubleshoot [section](../../#commong-issues-and-troubleshoot) first.
## Tutorial

If you are new to Angular 2, we recommend to check out our 15-steps Angular2+Meteor [tutorial](http://www.angular-meteor.com/tutorials/socially/angular2/bootstrapping).
> Please note, the tutorial above is about Angular2-Meteor version for Meteor 1.2, while current README focuses more on the version for Meteor 1.3. New version is in active development now.

## Quick Start

### Install package:

#### With Meteor 1.3:

Before installing any Angular2-Meteor's NPMs, we recommend to have Angular 2 NPM and 
its peer dependencies added in your `package.json`. The list you can find [here](https://github.com/Urigo/angular2-meteor/blob/master/package.json#L25).
It makes the chance to get "unmet peer dependency" warning is minimum for the future package updates.

After, you are ready to install Angular2-Meteor's NPMs:
````
    npm install angular2-meteor --save
    npm install angular2-meteor-auto-bootstrap --save
````

You'd likely prefer to install another one Meteor package as well  — `angular2-compilers`.
This package adds own HTML processor and TypeScript compiler to a Meteor app.
TypeScript is a language that makes development with Angular 2 really easy, and the only one
fully supported by the Angular2-Meteor currently. So one of the prerequisites will be to run:
````
   meteor add angular2-compilers
````

Please note that you'll have to remove the standard Meteor HTML processor if you have it installed.
The reason is that Meteor doesn't allow more then two processor for one extension:

````
   meteor remove blaze-html-templates
````

Angular 2 heavily relies on some polyfills and dependencies.
For example, in order to make it work, you'll need to load (import) `reflect-metatada` and `zone.js`
before you can use any component from `angular2` itself.

There is a way to overcome that inconvenience (i.e., importing dependencies manually):
you can install `barbatus:angular2-runtime`, a package that adds all required dependencies.
Since it's a package, it's loaded by Meteor before any user code.

> Note that current version of `barbatus:angular2-runtime` supports `beta-12` only.
> There is no guarantee that it'll work for newer versions of Angular 2.

Other notes:
- Meteor 1.3 uses CommonJS implementation for modules loading so you do not need to use SystemJS or any other loader!
- You'll have to add an index.html (can have any other name) even if your app template consists of one tag,
  e.g.,  `<body><app></app></body>`

#### With Meteor 1.2
````
   meteor add angular2-meteor
```` 

Notes:
- The compilers are part of this package
- Meteor 1.2 does not have modules loader, so you need to use SystemJS as modules loader (comes with this package!)

## Usage
### Import Angular2 into your app:
Package assumes TypeScript as the main language for development with Angular 2.

ES6 modules are supported via CommonsJS (starting in Meteor 1.3) module loader library.

To start, create `client/app.ts` file, import `Component` and then bootstrap the app:
````ts
    import {Component} from 'angular2/core';
    import {bootstrap} from 'angular2/bootstrap';

    @Component({
      selector: 'socially',
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

(Note that if you use Meteor 1.2, you need to use SystemJS imports to load your main file!)

### Start using Meteor in your Angular2 app:

This package comes with some modules that makes it easy to use Meteor in Angular 2.

You can use Meteor collections in the same way as you would do in a regular Meteor app with Blaze, you just need to use another `bootstrap` method, instead of the one the comes with Angular2:

````js
import {bootstrap} from 'angular2-meteor-auto-bootstrap';
````

And now you can iterate `Mongo.Cursor` objects with Angular 2.0 ngFor!

For example, change `client/app.ts` to:
````ts
    // ....

    @Component({
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

At this moment, you are ready to create awesome apps backed by the power of Angular 2 and Meteor!

To use Meteor features, make sure that your components extends `MeteorComponent`, and you can feature that comes from Meteor:

````ts
    import {Component} from 'angular2/core';
    import {bootstrap} from 'angular2-meteor-auto-bootstrap';
    import {MeteorComponent} from 'angular2-meteor';
    import {MyCollection} form '../model/my-collection.ts';

    @Component({
      selector: 'socially'
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

* For Meter 1.2: the Tutorial's [Socially app](https://github.com/Urigo/meteor-angular2.0-socially)
* For Meteor 1.3: [Todos](https://github.com/Urigo/Meteor-Angular2/tree/master/examples/todos-meteor-1.3) demo

## Server Side
You can use TypeScript also in the server side, so you can share you interfaces with both client and server!

Similar to the client's main module `app` file, Meteor checks for the existence of the `main` file in the server folder and, in case of success, will import it for you.

## TypeScript
The package uses [TypeScript for Meteor](https://github.com/barbatus/ts-compilers) to compile (transpile) `.ts`-files.

TypeScript configuration file a.k.a. `tsconfig.json` is supported as well. Place a file with this name at the root folder and start adding any available TypeScript options you want. You can read about all available compiler options [here] (https://github.com/Microsoft/TypeScript/wiki/tsconfig.json).

Default TypeScript options for Meteor 1.3 are as follows:
````json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "module": "commonjs",
    "target": "es5",
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "sourceMap": true
  }
}
````

For Meteor 1.2, options are the same as above except:
````json
{
  "compilerOptions": {
    "module": "system",
    "moduleResolution": "classic"
  }
}
````

### Typings

To add declaration files of any global 3-party JavaScript library including Meteor itself (so called ambient typings), we recommend to use [`typings`](https://github.com/typings/typings) utility, which is specially designed to be used for typigns management with access to global registries of common 3-party libraries.

As for Angular 2's typings and typings of the related packages, if you plan to use Meteor 1.3 and NPM packages you don't need to worry about them at all, as most of declaration files are provided in NPMs (at least for Angular 2 itself). If you plan to use Meteor 1.2  and Atmosphere packages, all required typigns will be installed (copied) automatically into the "typings" folder during the first run.

## Commong Issues and Troubleshoot

### Upgrading to Meteor 1.3

If you want to upgrade to Meteor 1.3 and use CommonJS modules,
but at the same time have some of the Atmosphere packages related to Angular 2 (like `barbatus:g2-google-maps`, `barbatus:ng2-meteor-accounts-ui` etc) installed, you’ll need to remove them.
The reason is they are based on SystemJS, which won’t work with Meteor 1.3 and `modules` package any more.
Use NPM equivalents instead since most of that atmosphere packages were anyways converted from NPMs.

For example, check out Angular2 Maps [here](https://www.npmjs.com/package/angular2-google-maps).
a NPM version of the Meteor Accounts UI for Angular 2 is currently under development.
You can find out some preliminary version [here](https://github.com/Urigo/angular2-meteor-accounts-ui).

### It works fine locally but fails to run in the production

This UglifyJS minification [issue](https://github.com/angular/angular/issues/6380) is likely to blame.
Read this [comment](https://github.com/angular/angular/issues/6380#issuecomment-203247147) to find out more info.

As a temporary solution, you could install `barbarous:ng2-minifier-js`, which
configures UglifyJS to skip renaming (mangling). So you’ll need:

````
meteor remove standard-minifier-js
meteor add  barbatus:ng2-minifier-js
````

## Roadmap

You can check out the package's roadmap and its status under this repository's issues.

## Contribution
If you know how to make integration of Angular 2 and Meteor better, you are very welcome!

For the coding style guide, we use AirBnB [rules](https://github.com/airbnb/javascript) with TypeScript specifics and max line width set to 100 symbols. Rules are partly enforced by the tslint.json file in the root (if you are not familiar with TSLint, read more [here](https://github.com/palantir/tslint)). Please, check that your code conforms with the rules before PR.

### Clone the source to your computer

In order to work with this package locally when using Meteor 1.3 project, follow these instructions:

1. Clone this repository to any folder. 
   Note that if you clone into Meteor project directory - you need to put the cloned folder inside a hidden file, so Meteor won't try to
   build it! Just create a folder that starts with `.` under your project root, it should look like that:
   ````
   MyProject
      .local-work
         angular2-meteor
      .meteor
      client
      server
      public
   ````

2. Make sure that you already have `node_modules` directory under your root, if not — create it:
   ````
   $ mkdir node_modules
   ````

   Also, make sure that you have a NPM project initialized in your directory (you should have `package.json`), if not — use:
   ````
   $ npm init
   ````

3. Make sure that you do not have angular2-meteor already - check under `node_modules` — if you do, delete it.

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
   
2. Or, you can keep the same code you have now, but you will need to build Angular2-Meteor source code each change you perform, by
   running `gulp build`.

### Troubleshoot

When working with local package, note that you should never have two local packages of `angular2` package, you should have it only under `node_modules/angular2` of the root directory. 
In case of weird errors regarding missing direcrtives - make sure that you do not have a copy of `angular2` package under `node_modules/angular2-meteor/node_modules/angular2`!

[npm-downloads-image]: http://img.shields.io/npm/dm/angular2-meteor.svg?style=flat
[npm-version-image]: http://img.shields.io/npm/v/angular2-meteor.svg?style=flat
[npm-url]: https://npmjs.org/package/angular2-meteor
