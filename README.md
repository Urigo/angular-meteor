<a href="http://angular-meteor.com/"><img src="https://s22.postimg.org/vpn3d97ch/logo_large.png" width="120" height="120" /></a>  

[![NPM version][npm-version-image]][npm-url] [![NPM downloads][npm-downloads-image]][npm-url] [![Build Status](https://travis-ci.org/Urigo/angular-meteor.svg?branch=master)](https://travis-ci.org/Urigo/angular-meteor)  [![Join the chat at https://gitter.im/Reactive-Extensions/RxJS](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Urigo/angular-meteor)

Angular 2 + Meteor integration.

## Table of Contents
* [Tutorial](../../#tutorial)
* [Quick Start](../../#quick-start)
    * [Install package](../../#install-package)
    * [Using Angular 2 in a Meteor app](../../#using-angular-2-in-a-meteor-app)
* [Demos](../../#demos)
* [TypeScript](../../#typescript)
* [Roadmap](../../#roadmap)
* [Contribution](../../#contribution)

## Tutorial

If you are new to Angular2 and/or Meteor but want to learn them quickly, 
please check out our 23-steps Angular2-Meteor [tutorial](http://www.angular-meteor.com/tutorials/socially/angular2/bootstrapping).

## Questions and Issues

If you have rather a question than an issue, please consider the following resources at first:
- [Gitter](https://gitter.im/Urigo/angular-meteor)
- [Stack Overflow `angular2-meteor` tag](http://stackoverflow.com/questions/tagged/angular2-meteor)
- [Meteor forum](https://forums.meteor.com/c/angular)

The chances to get a quick response there is higher than posting a new issue here.

If you've decided that it's likely a real issue, please consider going through the following list at first:
- Check quickly recently [created](https://github.com/Urigo/angular2-meteor/issues)/[closed](https://github.com/Urigo/angular2-meteor/issues?q=is%3Aissue+is%3Aclosed) issues: chances are high that someone's already created a similar one
  or similar issue's been resolved;
- If your issue looks nontrivial, we would approciate a small demo to reproduce it.
  You will also get a response much faster.

## Quick Start

### Install package:

#### From Boilerplate 

Start by creating an application from our boilerplate:

```
   $ meteor create --example angular2-boilerplate myApp
   $ cd myApp
   $ meteor npm install
```

> Alternatively, use your web browser to access the link:
> https://github.com/Urigo/angular2-meteor-base
> Download the template application, and unzip the files inside. Rename the folder to "socially" and place it into the default directory.

Then run the application:

```
   $ meteor
```

#### Manual Installation

To install Angular2-Meteor's NPMs:
```
    $ npm install angular2-meteor angular2-meteor-polyfills babel-runtime --save
```

Second step is to add `angular2-compilers` package — `$ meteor add angular2-compilers`.
This package adds custom HTML processor, LESS, SASS and TypeScript compilers.
Custom HTML processor and Style compilers make sure that static resources can be used
in the way that Angular 2 requires, and TypeScript is a recommended JS-superset to develop with Angular 2.

Please note that you'll have to remove the standard Meteor HTML processor (and LESS package).
The reason is that Meteor doesn't allow more than two processor for one extension:

```
   $ meteor remove blaze-html-templates
```

Angular 2 heavily relies on some polyfills (`zone.js`, `reflect-metadata` etc).
There are two ways to add them:
- Add `import 'angular2-meteor-polyfills'` at the top of ts-file that is loaded first;

Please, don't forget to add a main HTML file (can be `index.html` or with any other name) even if your app template consists of one single tag,
e.g., `<body><app></app></body>`.

### Usage

#### With Meteor-RxJS

We recommend to use [meteor-rxjs](https://www.angular-meteor.com/meteor-rxjs) to create you application. 

You can find more instructions [here](https://github.com/Urigo/meteor-rxjs/blob/master/README.md) and in the [API documentation](https://github.com/Urigo/meteor-rxjs/tree/master/docs)


#### Without Meteor-RxJS

The package contains `METEOR_PROVIDERS` providers that simplify development of a Meteor app with Angular 2.

You can use Mongo collections in the same way as you would do in a regular Meteor app with the Blaze,
the only thing required is to import and use `METEOR_PROVIDERS` from `angular2-meteor`.
After, you can iterate `Mongo.Cursor`s with Angular 2.0's `ngFor` as follows:

```ts
    import {METEOR_PROVIDERS, MeteorReactive} from 'angular2-meteor';

    const Parties = new Mongo.Collection('parties');
    
    @Component({
      template: `
        <div *ngFor="let party of parties">
          <p>Name: {{party.name}}</p>
        </div>
      `
    })
    class Socially extends MeteorReactive {
        constructor() {
          this.subscribe('my-subscription');
          this.parties = Parties.find();
        }
    }

    @NgModule({
      imports: [BrowserModule],
      providers: METEOR_PROVIDERS,
      declarations: [Socially],
      bootstrap: [Socially]
    })
    export class AppModule { }

    platformBrowserDynamic().bootstrapModule(AppModule);
```
`MeteorReactive` is a special utility class that does two things behind the scene for you:
 - releases Meteor and Mongo handlers on the destroy event;
 - runs Angular 2 zone on Meteor methods' callbacks with
   debouncing, i.e., reducing number of zone runs to minimun.

You can read more about `MeteorReactive` in the [tutorial section] (http://www.angular-meteor.com/tutorials/socially/angular2/privacy-and-publish-subscribe-functions)!

At this moment, you are almost set to create awesome apps backed by the power of Angular 2 and Meteor!
We recommend to check out our awesome [tutorial](http://www.angular-meteor.com/tutorials/socially/angular2/bootstrapping) in order to create more complex apps that have security and routing.

## Demos

Check out two demos for the quick how-to:

* the Tutorial's [Socially app](https://github.com/Urigo/meteor-angular2.0-socially)

## Static Resources

Angular 2 allows to define a component's template and styles in two ways: using template content inline
or using template URL. We recommend to use inline templates.

For that purpose, `angular2-compilers`'s HTML, LESS, and SASS compilers process associated files and
add Node JS-modules that export string file contents outside.
After, one can import a template content in ES6 style:
```
  import template from  './foo.html';

  import style from './foo.less';
```

For more information, please check out [css-compiler](https://github.com/Urigo/angular2-meteor/tree/master/atmosphere-packages/css-compiler)
and [static-templates](https://github.com/Urigo/meteor-static-templates).

## TypeScript
The package uses [TypeScript for Meteor](https://github.com/barbatus/typescript) to compile (transpile) `.ts`-files.

TypeScript configuration file a.k.a. `tsconfig.json` is supported as well.

Please note that `tsconfig.json` is not required, but if you want to configure TypeScript
in your IDE or add more options, place `tsconfig.json` in the root folder of your app.
You can read about all available compiler options [here](https://github.com/Microsoft/TypeScript/wiki/tsconfig.json).

Default TypeScript options for Meteor 1.4 are as follows:
```json
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
```

> Angular2-Meteor boilerplate comes with a predefined and ready-to-use TypeScript config file.

## Babel

It's **possible** to use Angular2 with Babel as the primary language.

To make development as convenient as it would be if you chose TypeScript,
there exist special Babel plugins. So you'll need to install them:

```
  npm i babel-plugin-angular2-annotations babel-plugin-transform-decorators-legacy babel-plugin-transform-class-properties babel-plugin-transform-flow-strip-types --save-dev
```

Then add `.babelrc` as follows:
```json
{
  "plugins": [
    "angular2-annotations",
    "transform-decorators-legacy",
    "transform-class-properties",
    "transform-flow-strip-types"
  ]
}
```

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
