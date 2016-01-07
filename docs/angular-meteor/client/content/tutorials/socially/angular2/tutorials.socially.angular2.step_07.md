{{#template name="tutorials.socially.angular2.step_07.md"}}
{{> downloadPreviousStep stepName="step_06"}}  

In this step we will briefly review the file structure our Socially app has so far,
also we’ll look closely into certain TypeScript features since having a better understanding of the primary programming language of this package would be surely beneficial.

# File Structure

As you have probably noticed, our tutorial app has a strict modular structure at this point:
there are no pure JavaScript files that are being bundled together and auto-executed, so Meteor's file loading conventions doesn't have an effect.
Even more, every .ts-file is being compiled into a separate System.j module, which we can then import whenever we need to.

There is another thing worth mentioning once more. As you know, Meteor has two special folders: _client_ and _server_.
We can benefit from them (and have already done so in this app) by allowing access to the client side modules from the client side only and, accordingly, to server side modules from the server side.
Everything outside of those folders will be available to the both client and server.
It’s no wonder why this is a recommended approach in Meteor, and this is why we’ve been doing it so far.
Let's stick to it further.

# TypeScript

TypeScript is a rather new language that has been around for 3 years only.
Since then it’s been gaining [popularity](https://www.google.com/trends/explore#q=%2Fm%2F0n50hxv) due to various reasons. Among them is one of the fullest implementations of ES2015 features
on the market: including some of the experimental ones, pseudo type-checking and a rich toolset developed by Microsoft and the TypeScript community.
It has support already in all major IDEs including Visual Studio, WebStorm, Sublime etc.

One of the hottest questions in JavaScript, that has been around since the Web 2.0 era started, was how to make JavaScript less bug-prone and
suitable for big projects. In the OOP world, well-known solutions include modularity and strict type-checking. While OOP is available in JavaScript in some way,
it turned out to be very hard to create a good type-checking due to, first of all, JavaScript's flexibility. One always needs to impose a certain number of rules to
follow to make a JavaScript compiler effective. For many years, we’ve seen around a number of solutions including Closure Compiler and GWT from Google, a bunch of C#-to-JavaScript compilers and others.

This was, for sure, one of the problems the TypeScript team were striving to solve: to create a language that would inherit the flexibility of JavaScript while, at the same time, having effective type-checking with minimum effort required from the user. There should have been some kind of [middle way](https://en.wikipedia.org/wiki/Middle_Way).
And they found it, having introduced the type declaration files. These are files of a special kind where you describe interfaces your classes expose along with signatures of the methods and types of the parameters they take, so that TypeScript will be able to refer to these files to verify the correctness of your class's API.
Of course, the flexibility is still there which means if you don’t want to declare types you can skip them right away.

As you may have noticed, Angular2-Meteor package itself installs a number of these files into the _typings_ folder.
Some of them have names `angular2.d.ts` and `meteor.d.ts`, which, as you can guess, are used to verify that API of Meteor and Angular 2 are being used correctly in your code.
But as you remember, we've mentioned so far only one declaration file `angular2-meteor.d.ts` and used it in the TypeScript config (on the first step), that's thanks to a special TypeScript syntax construction that can link
together one declaration files with other declaration files as well as TypeScript files. If you look inside of `angular2-meteor.d.ts` you'll see 
Angular 2 and Meteor declaration files are linked there by:

    /// <reference path="angular2.d.ts" />
    /// <reference path="meteor/meteor.d.ts" />

But let’s create our own declaration file in order to learn this type-checking better.
Keep in mind, type-checking is not delivered in the outputted JavaScript. It is only extra sugar for your development environment, and adds no weight to the outputted .js file.

## Custom Type Declaration File

There is one definite place in our app where we could make use of it to avoid potential bugs.
We are going to declare a `Party` type with already familiar to you properties: "name", "description" and "location". "Description" property will be optional.

Let's create `party.d.ts` file and place it inside _typings_ folder with the following content:

{{> DiffBox tutorialName="meteor-angular2-socially" step="7.1"}}

Then, we add this file to the app's _tsconfig.json_ to be compiled along with other TypeScript file:

{{> DiffBox tutorialName="meteor-angular2-socially" step="7.2"}}

One of the places where the declared type can be used is in the definition of the parties collection in `collections/parties.ts`.
Let’s change the code to:

{{> DiffBox tutorialName="meteor-angular2-socially" step="7.3"}}

As you can see, we used a generic type `Mongo.Collection<>` with the class parameter set to `Party` instead of just basic
`Mongo.Collection` class.

Now let’s fiddle with it. Go to the _client/parties-form/parties-form.ts_ file and change “location” property to, say,
“newLocation”. Run the app. You should see in the console a warning saying in a nutshell: there is no “newLocation” property defined on the `Party` type.

Let’s torture it more. Please, go to the _client/parties-list/parties-list.ts_.
There you’ll see the "parties" property assigned to the `Mongo.Cursor<Object>` type. As you can see, TypeScript considers this construct acceptable even there is no `Party` type mentioned. That’s because Object type is the base class to all types available in JavaScript, so TypeScript doesn’t swear confronting to the OOP principles.

But let’s change it to `Mongo.Cursor<string>`. Run the app and you will see it’s swearing again.
TypeScript doesn’t know how to convert `Mongo.Cursor<string>` to `Mongo.Cursor<Party>`, so it considers the assigment to be wrong.

Isn’t it cool?! We’ve made our app to be bug persistent with only few changes!

Finally, let’s change `Object` to `Party` in the `PartiesList` and `PartyDetails` components to make our code look right:

{{> DiffBox tutorialName="meteor-angular2-socially" step="7.4"}}

{{> DiffBox tutorialName="meteor-angular2-socially" step="7.5"}}

## TSD

[TSD](https://github.com/DefinitelyTyped/tsd) is a package manager for type definition files from [Definitely Typed](http://definitelytyped.org/).

    npm install tsd -g

Many of us will use different third-party TypeScript libraries in projects, so
TSD is worth to be mentioned. This tool allows to search, install and update
declaration files from one global repository of declaration files kept by the TypeScript community.

For example, you can use `tsd query NAME` to search for a specific package NAME:

    tsd query angular2
    > - angular2 / angular2

To install Meteor declaration file, just type:

    tsd install meteor

All necessary files will be added into the _typings_ directory.

Angular 2's declaration files are delivered via the offial NPM, so 
you won't be able to find it in the Definitely Typed repo.

Don't worry though, Angular2-Meteor will update all necessary typings, you only need periodically
to remove .d.ts-files in the _typings_ folder, thus, letting the package know that
the files need to be updated.

## TypeScript Configuration and IDEs

As you already know from the bootstrapping step,
TypeScript is generally configured by the special JSON file called [_tsconfig.json_](https://github.com/Microsoft/typescript/wiki/tsconfig.json).

TypeScript language today has development plugins in many popular IDEs, including Visual Studio, WebStorm, Sublime etc.
These plugins work in same style as it's become de facto today — compile, using TypeScript shell command, .ts-files behind the scene as you change them.
With that, if you've configured your project right and has declaration files in place you'll get bunch of invaluable features such as instantaneous highlighting of
the compilation errors and code completion.

If you use one of the mentioned IDEs, you've likely noticed that bunch of the code lines
are now marked in red, which means TypeScript plugins don't work right; at the time we don't see any errors in the teminal.
That's because most of the plugins recognize _tsconfig.json_ as well if it's placed in the root folder,
but so far our _tsconfig.json_ contains only "files" property, which is certantly not enough for
a general compilation. At the same time, Angular2-Meteor's TypeScript compiler, defaults most of the
compilation options internally to fit our needs. To fix plugins, let's set up _tsconfig.json_
with the options that will make plugins understand our needs and the structure of our app.

We are going to point out that we are using System.js and decorators, also
we'll need to include entry point files of the client and server sides to let plugins know what to compile:

{{> DiffBox tutorialName="meteor-angular2-socially" step="7.6"}}

Now, let's go to any of the .ts-files and check out that all that annoying redness has been gone.

> Note: you may need to reload you IDE to pick up the lastest changes to the config.

Please note, since Meteor environment is quite specific, some of the options are not making sense in Meteor.
You can read about the exceptions [here](https://github.com/barbatus/typescript#compiler-options).
TypeScipt compiler of this package supports some additional options that might be useful in the Meteor environment.
They can be included in the "meteorCompilerOptions" section of _tsconfig.json_ and described [here](https://github.com/barbatus/ts-compilers#typescript-config).

# Summary

In this step we discovered a new way to make TypeScript code less buggy by using TypeScript's type-checking.
Meanwhile we declared a new type for the party object, thus, made the type-checking partially available in the Socially app.
  
{{/template}}
