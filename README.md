# Angular2-Meteor [![NPM version][npm-version-image]][npm-url] [![NPM downloads][npm-downloads-image]][npm-url] [![Build Status](https://travis-ci.org/Urigo/angular2-meteor.svg?branch=master)](https://travis-ci.org/Urigo/angular2-meteor)  [![Join the chat at https://gitter.im/Reactive-Extensions/RxJS](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Urigo/angular-meteor)
Angular2 + Meteor integration.

## Table of Contents
* [Tutorial](../../#tutorial)
* [Questions and Issues](../../#questions-and-issues)
* [Quick Start](../../#quick-start)
    * [Install package](../../#install-package)
    * [Import Angular2 into your app](../../#import-angular2-into-your-app)
    * [Start using Meteor in your angular2 app](../../#start-using-meteor-in-your-angular2-app)
* [Demos](../../#demos)
* [Server Side](../../#server-side)
* [TypeScript](../../#typescript)
* [Roadmap](../../#roadmap)
* [Contribution](../../#contribution)

## Tutorial

If you are new to Angular2 and/or Meteor but want to learn them quickly, 
please check out our 23-steps Angular2-Meteor [tutorial](http://www.angular-meteor.com/tutorials/socially/angular2/bootstrapping).

## Questions and Issues

If you have rather a question than an issue, please consider the following resources at first:
- [Stack Overflow `angular2-meteor` tag](http://stackoverflow.com/questions/tagged/angular2-meteor)
- [Meteor forum](https://forums.meteor.com/c/angular)
- [Gitter](https://gitter.im/Urigo/angular-meteor)
- [Report issues](https://github.com/Urigo/angular-meteor/issues)

The chances to get a quick response there may be quite higher than posting a new issue here.

If you've decided that it's likely a real issue, please consider going through the following list at first:
- Check out common issues and troubleshoot [section](../../#common-issues-and-troubleshoot);
- Check quickly recently [created](https://github.com/Urigo/angular2-meteor/issues)/[closed](https://github.com/Urigo/angular2-meteor/issues?q=is%3Aissue+is%3Aclosed) issues: chances are high that
  someone's already created a similar one or similar issue's been resolved;
- If your issue looks nontrivial, we would approciate a small demo to reproduce it.
  You will also get a response much faster.
 
## Quick Start

### Install package:

Before installing any Angular2-Meteor's NPMs, we recommend to have Angular 2 NPM and 
its peer dependencies added in your `package.json`. You can find such a list [here](https://github.com/Urigo/angular2-meteor/blob/master/package.json#L25).
It minimizes the chance to get "unmet peer dependency" warnings in the future package updates.

After that, you are ready to install Angular2-Meteor's NPMs:
````
    npm install angular2-meteor --save
    npm install angular2-meteor-auto-bootstrap --save
````

You'd likely prefer to install another Meteor package as well  — `angular2-compilers`.
This package adds our own HTML processor and TypeScript compiler to a Meteor app.
TypeScript is a language that makes development with Angular 2 really easy, and currently the only one
fully supported by the Angular2-Meteor. So one of the prerequisites will be to run:
````
   meteor add angular2-compilers
````

Please note that you'll have to remove the standard Meteor HTML processor if you have it installed.
The reason is that Meteor doesn't allow more than two processor for one extension:

````
   meteor remove blaze-html-templates
````

Angular 2 heavily relies on some polyfills and dependencies.
For example, in order to make it work, you'll need to load (import) `reflect-metatada` and `zone.js`
before you can use any component from `angular2` itself.

There is a way to overcome that inconvenience (i.e., importing dependencies manually):
you can install `barbatus:angular2-runtime`, a package that adds all the required dependencies.
Since it's a package, it's loaded by Meteor before any user code.

Please don't forget to add a main HTML file (can be `index.html` or with any other name) even if your app template consists of one single tag,
e.g., `<body><app></app></body>`.

### Import Angular2 into your app:
This package assumes TypeScript as the main language for development with Angular 2.

ES6 modules are supported via CommonsJS (introduced in Meteor 1.3) module loader library.

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

Add `index.html` file to the app root folder:
````html
    <body>
       <socially></socially>
    </body>
````
At this point you should see the app working and showing "Hello word".

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
You read more about `MeteorComponent` in the [tutorial section] (http://www.angular-meteor.com/tutorials/socially/angular2/privacy-and-publish-subscribe-functions)!

## Demos

Check out two demos for the quick how-to:

* the Tutorial's [Socially app](https://github.com/Urigo/meteor-angular2.0-socially)
* Simple [Todos](https://github.com/Urigo/Meteor-Angular2/tree/master/examples/todos-meteor-1.3) demo

## Server Side
One of the big advantages of Meteor is that you can use TypeScript and CommonJS on the server side as well.

It means that you can easily share your code between client and server!

## TypeScript
The package uses [TypeScript for Meteor](https://github.com/barbatus/typescript) to compile (transpile) `.ts`-files.

TypeScript configuration file a.k.a. `tsconfig.json` is supported as well.

Please note that `tsconfig.json` is not required, but if you want to configure TypeScript
in your IDE or add more options, place `tsconfig.json` in the root folder of your app.
You can read about all available compiler options [here](https://github.com/Microsoft/TypeScript/wiki/tsconfig.json).

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

### Typings

To add declaration files of any global 3-party JavaScript library including Meteor itself (so called ambient typings), we recommend to use the [`typings`](https://github.com/typings/typings) utility, which is specially designed to be used for typings management with access to global registries of common 3-party libraries.

For example, to install Meteor declaration file run:
````
npm install typings -g

typings install meteor --ambient
````

Please note that you don't need to worry about Angular 2's typings and typings of the related packages!
TypeScript finds and checkes them in NPMs automatically.

## Common Issues and Troubleshoot

### Upgrading to Meteor 1.3

Please don't use Atmosphere packages related to Angular 2 with Meteor 1.3, use NPM equivalents instead;
most of these atmosphere packages were anyways converted from NPMs.
The reason is they are based on SystemJS, which won’t work with Meteor 1.3 and `modules` package any more.

For example, check out Angular2 Maps [here](https://www.npmjs.com/package/angular2-google-maps).
Angular 2 version of the Meteor Accounts UI is currently under development.
You can find out some preliminary version [here](https://github.com/Urigo/angular2-meteor-accounts-ui).

### It works fine locally but fails to run in the production

This UglifyJS minification [issue](https://github.com/angular/angular/issues/6380) is likely to blame.
Read this [comment](https://github.com/angular/angular/issues/6380#issuecomment-203247147) to find out more info.

As a temporary solution, you could install `barbatus:ng2-minifier-js`, which
configures UglifyJS to skip renaming (mangling). So you’ll need:

````
meteor remove standard-minifier-js
meteor add  barbatus:ng2-minifier-js
````

## Change Log

Change log of the package is located [here](CHANGELOG.md).

## Roadmap

You can check out the package's roadmap and its status under this repository's issues.

## Contribution
If you know how to make integration of Angular 2 and Meteor better, you are very welcome!

Check out [CONTRIBUTION.md](CONTRIBUTION.md) for more info.

[npm-downloads-image]: http://img.shields.io/npm/dm/angular2-meteor.svg?style=flat
[npm-version-image]: http://img.shields.io/npm/v/angular2-meteor.svg?style=flat
[npm-url]: https://npmjs.org/package/angular2-meteor
