{{#template name="tutorials.socially.angular2.step_07.md"}}
{{> downloadPreviousStep stepName="step_06"}}  

In this step we will:

- review the file structure of our Socially app so far,
- look closer into certain TypeScript features, since having a better understanding of the primary programming language of this package would be surely beneficial

# File Structure

As you have probably noticed, our tutorial app has a strict modular structure at this point:
there are no pure JavaScript files that are being bundled together and auto-executed, so Meteor's file loading conventions doesn't have any effect.
Even more, every `.ts` file is being compiled into a separate System.js module, which we can then import whenever we need to.

There is another thing worth mentioning once more. As you know, Meteor has two special folders: _client_ and _server_.
We can benefit from them (and have already done so in this app) by allowing access to the client side modules from the client side only and, accordingly, to server side modules from the server side.
Everything outside of those folders will be available to the both client and server.
It’s no wonder why this is a recommended approach in Meteor, and this is why we’ve been doing it so far.
Let's stick to it further.

# TypeScript

TypeScript is a rather new language that has been growing in [popularity](https://www.google.com/trends/explore#q=%2Fm%2F0n50hxv) since it's creation 3 years ago. TypeScript has one of the fullest implementations of ES2015 features on the market: including some experimental features, pseudo type-checking and a rich toolset developed by Microsoft and the TypeScript community. It has support already in all major IDEs including Visual Studio, WebStorm, Sublime, Atom, etc.

One of the biggest issues in JavaScript is making code less bug-prone and more suitable for big projects. In the OOP world, well-known solutions include modularity and strict type-checking. While OOP is available in JavaScript in some way, it turned out to be very hard to create good type-checking. One always needs to impose a certain number of rules to follow to make a JavaScript compiler more effective. For many years, we’ve seen around a number of solutions including the Closure Compiler and GWT from Google, a bunch of C#-to-JavaScript compilers and others.

This was, for sure, one of the problems the TypeScript team were striving to solve: to create a language that would inherit the flexibility of JavaScript while, at the same time, having effective and optional type-checking with minimum effort required from the user.

## Type Declaration Files

As you may have noticed, Angular2-Meteor package itself installs a number of type declaration (`.d.ts`) files into the _typings_ folder. These are files of a special kind where you describe the interfaces for your classes along with signatures of the methods and types of the parameters they take, so that TypeScript will be able to refer to these files to verify the correctness of your class's API. Of course, the flexibility is still there so if you don’t want to declare types you can skip them right away.

Keep in mind, type-checking is not delivered in the outputted JavaScript. It is only extra sugar for your development environment, and adds no weight to the outputted .js file.

Some of the typings files have names `angular2.d.ts` and `meteor.d.ts`, which, as you can guess, are used to verify that API of Meteor and Angular 2 are being used correctly in your code

But as you remember, we've mentioned so far only one declaration file `angular2-meteor.d.ts` and used it in the TypeScript config (on the first step), that's thanks to a special TypeScript syntax construction that can link together one declaration files with other declaration files as well as TypeScript files. If you look inside of `angular2-meteor.d.ts` you'll see Angular 2 and Meteor declaration files are linked there by:

    /// <reference path="../angular2/angular2.d.ts" />
    /// <reference path="../meteor/meteor.d.ts" />

Let’s create our own declaration file for our project in order to learn this type-checking better.

## Custom Type Declaration File

There is one definite place in our app where we could make use of types to avoid potential bugs.
We are going to declare a `Party` interface, you should already be familiar with its properties: "name", "description" and "location". We can make the "Description" property optional.
TypeScript's type-checking bases on the "shapes" that types have. And intefaces are TypeScript's means to describe these type "shapes", which 
is sometimes called "duck typing". More on that you can read [here](http://www.typescriptlang.org/Handbook#interfaces).

Let's create our `party.d.ts` file and place it inside the _typings_ folder with the following content:

{{> DiffBox tutorialName="meteor-angular2-socially" step="7.1"}}

Then, we add this file to the app's _tsconfig.json_ to be compiled along with other TypeScript file:

{{> DiffBox tutorialName="meteor-angular2-socially" step="7.2"}}

Wherever Party is used, we can declare the type. Let's start by clarifying the parties collection in `collections/parties.ts`.
Change the code to:

{{> DiffBox tutorialName="meteor-angular2-socially" step="7.3"}}

As you can see, we used a generic type `Mongo.Collection<>` with the class parameter set to `Party` instead of just basic
`Mongo.Collection` class.

Now let’s fiddle with it. Go to the _client/parties-form/parties-form.ts_ file and change “location” property to, say,
“newLocation”. Run the app. You should see in the console a warning saying in a nutshell: there is no “newLocation” property defined on the `Party` type.

Let’s torture it more. Go to the _client/parties-list/parties-list.ts_.
There you’ll see the "parties" property assigned to the `Mongo.Cursor<Object>` type. As you can see, TypeScript considers this construct acceptable even there is no `Party` type mentioned. That’s because Object type is the base class to all types available in JavaScript, so TypeScript doesn’t swear confronting to the OOP principles.

But let’s change it to `Mongo.Cursor<string>`. Run the app and you will see the compiler is unhappy with you again. TypeScript doesn’t know how to convert `Mongo.Cursor<string>` to `Mongo.Cursor<Party>`, so it considers the assignment to be wrong.

Isn’t it cool?! We’ve made our app more bug resistant with only a few changes!

Finally, let’s change `Object` to `Party` in the `PartiesList` and `PartyDetails` components to make our code look right:

{{> DiffBox tutorialName="meteor-angular2-socially" step="7.4"}}

{{> DiffBox tutorialName="meteor-angular2-socially" step="7.5"}}

## TypeScript Configuration and IDEs

As you already know from the bootstrapping step, TypeScript is generally configured by a special JSON file called [_tsconfig.json_](https://github.com/Microsoft/typescript/wiki/tsconfig.json).

As mentioned, the TypeScript language today has development plugins in many [popular IDEs](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support), including Visual Studio, WebStorm, Sublime, Atom etc. These plugins work in the same style as it's become de facto today — compile, using TypeScript shell command, `.ts` and `tsconfig.json` files update automatically as you change them.
With that, if you've configured your project right with declaration files in place you'll get a bunch of invaluable features such as better code completion and instantaneous highlighting of compilation errors.

If you use one of the mentioned IDEs, you've likely noticed that a bunch of the code lines
are now marked in red, indicating the TypeScript plugins don't work right quite yet.

That's because most of the plugins recognize _tsconfig.json_ as well if it's placed in the root folder,
but so far our _tsconfig.json_ contains only a "files" property, which is certainly not enough for
a general compilation. At the same time, Angular2-Meteor's TypeScript compiler, defaults most of the
compilation options internally to fit our needs. To fix plugins, let's set up our _tsconfig.json_
properly with the options that will make plugins understand our needs and the structure of our app.

We are going to point out that we are using System.js and decorators, also
we'll need to include entry point files of the client and server sides to let plugins know what to compile:

{{> DiffBox tutorialName="meteor-angular2-socially" step="7.6"}}

Now, let's go to any of the `.ts` files and check if all that annoying redness has disappeared.

> Note: you may need to reload you IDE to pick up the latest changes to the config.

Please note, since the Meteor environment is quite specific, some of the `tsconfig.json` options won't make sense in Meteor. You can read about the exceptions [here](https://github.com/barbatus/typescript#compiler-options).
TypeScript compiler of this package supports some additional options that might be useful in the Meteor environment.
They can be included in the "meteorCompilerOptions" section of _tsconfig.json_ and described [here](https://github.com/barbatus/ts-compilers#typescript-config).

### IDE Specific Configurations

##### Atom

If you are using [Atom](atom.io) as your editor with the [Atom-TypeScript plugin](https://github.com/TypeStrong/atom-typescript), use the following configuration to automatically generate your `tsconfig.json` file:

```js
{
 "atom": {
    "rewriteTsconfig": true
  },
  "compileOnSave": false,
  "buildOnSave": false,
  "compilerOptions": {
    "target": "es5",
    "module": "system",
    "moduleResolution": "classic",
    "experimentalDecorators": true
  },
  "filesGlob": [
    "**/*.ts"
  ],
  "files": []
}
```

# Challange

We've tried out type-checking for the `Party` type in a couple of places in this step.
There are still some places left where the type is used but parameters are not defined, for example,
the party saving method. Try to correct remaining places to use `Party` as this step's challenge.

# Summary

In this step we discovered how to make our TypeScript code less buggy with:

- the benefits of type-checking
- type declaration files for verifying library APIs
- custom declaration files to check our own projects APIs
- TSD for loading declaration files easily
- creating a `tsconfig.json` file for loading files and specifying compiler options

In the [next step](/tutorials/angular2/user-accounts-authentication-and-permissions) we'll look at creating user accounts and securing server data access.

{{/template}}
