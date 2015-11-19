{{#template name="tutorials.socially.angular2.step_07.md"}}
{{> downloadPreviousStep stepName="step_06"}}  

In this step we will review briefly files structure our Socially app has so far,
also we’ll look closely into TypeScript features since knowing better primary programming language of this package would be surely beneficial.

# File Structure

As you probably have noticed, our tutorial app has a strict modular structure at this point:
there is no pure JavaScript files that are being bundled together and auto-executed, so Meteor's file loading conventions don't have effect.
Even more, every .ts-file is being compiled into a separate System.j module, which we can then import whenever we need to.

There is another one thing worth sounding once more. As you know, Meteor has two special folders: **client** and **server**  .
We can benefit from them (and already done it in this app) too by allowing access to the client side modules from the client side only and, accordingly, to server side modules from the server side.
Everything outside them will be available to both parts.
It’s, no wonder, a recommended approach in Meteor, and this is how we’ve been doing it so far.
Let's stick to it further.

# TypeScript

TypeScript is ather new language - it’s been around for 3 year only.
Since then it’s been gaining [popularity](https://www.google.com/trends/explore#q=%2Fm%2F0n50hxv) due to various reasons. Among them are one of the fullest implementation of the ES2015 standard's features
on the market including some of the experimental ones, pseudo type-checking and rich toolset developed by Microsoft and TypeScript community.
It has already support in all major IDEs including Visual Studio, WebStorm, Sublime etc.

One of the hottest questions in JavaScript, that has been around since the web 2.0 era started, was how to make JavaScript less bug-prone and
suitable for big projects. In the OOP world, well-known solutions include modularity and strict type-checking. While OOP is available in JavaScript in some way,
it turned out to be very hard to create a good type-checking due to, first of all, JavaScript's flexibility. One always needs to impose a certain number of rules to
follow to make a JavaScript compiler effective. For many years, we’ve seen around a number of solutions including Closure Compiler and GWT from Google, a bunch of C#-to-JavaScript compilers and others.

This was, for sure, one of the questions why TypeScript team were striving to solve: to create a language that would inherit flexibility of JavaScript while would have, at the same, effective type-checking with minimum amount of effort required from the user. There should have been some kind of [middle way](https://en.wikipedia.org/wiki/Middle_Way).
They found it, having introduced type declaration files. These are files of special kind where you describe interfaces your classes expose along with signatures of the methods and types of the parameters they take, so that TypeScript will be able to refer to these files to verify correctness of your class's API.
Of course, flexibility is still there which means if you don’t want to declare types you can skip them right away.

Usage of the declaration files was mentioned multiple time in this tutorial before with the `/// <reference path=".." />` syntax. By this way, we tell TypeScript what declaration files to check when it is compiling a particular .ts-file.

As you may have noticed, Angular2-Meteor package itself installs a number of these files into the **typings** folder.
Some of them have names `angular2.d.ts` and `meteor.d.ts`, which, as you can guess, are used to verify that API of Meteor and Angular 2 are being used correctly in your code.

But let’s create own declaration file to learn this type-checking better.
Keep in mind, type-checking is not delivered in the outputted JavaScript. It is only extra sugar for your development environment, and adds no weight to the outputted .js file.

## Type Declaration Files

There is one definite place in our app where we could make use of it to avoid potential bugs.
We are going to declare a `Party` type with already familiar to you properties: "name", "description" and "location". "Description" property will be optional.

Let's create `party.d.ts` file and place it inside “typings” folder with the following content:

{{> DiffBox tutorialName="meteor-angular2-socially" step="7.1"}}

One of the places where declared type can be used is a definition of the parties collection in `collections/parties.ts`.
Let’s change the code to:

{{> DiffBox tutorialName="meteor-angular2-socially" step="7.2"}}

As you can see, we used a generic type `Mongo.Collection<>` with the class parameter set to `Party` instead of just basic
`Mongo.Collection` class. We also referenced our new declaration file using `/// <reference.../>` syntax.

Now let’s fiddle with it. Go to the `client/parties-form/parties-form.ts` file and change “location” property to, say,
“newLocation”. Run the app. You should see in the console a warning saying in a nutshell: there is no “newLocation” property defined on the `Party` type.

If you program in, say, Visual Studio or in Sublime with the official TypeScript plugin,
you will see all that errors highlighted red instantaneously, which makes this TypeScript's type-cheking feature invaluable.

Let’s torture it more. Please, go to the `client/parties-list/parties-list.ts`.
There you’ll see the `parties` property assigned to the `Mongo.Cursor<Object>` type. As you can see, TypeScript considers this construct acceptable even there is no `Party` type mentioned. That’s because Object type is the base class to all types available in JavaScript, so TypeScript doesn’t swear confronting to the OOP principles.

But let’s change it to `Mongo.Cursor<string>`. Run the app and you will see it’s swearing again.
TypeScript doesn’t know how to convert `Mongo.Cursor<string>` to `Mongo.Cursor<Party>`, so it considers the assigment to be wrong.

Isn’t cool?! We’ve made our app to be bug persistent with only few changes!

Finally, let’s change `Object` to `Party` in the `parties-list.ts` and `party-details.ts` files to make our code look right:

{{> DiffBox tutorialName="meteor-angular2-socially" step="7.3"}}

{{> DiffBox tutorialName="meteor-angular2-socially" step="7.4"}}

## TSD

[TSD](https://github.com/DefinitelyTyped/tsd) is a package manager for type definition files from [Definitely Typed](http://definitelytyped.org/).

    npm install tsd -g

Many of us will use different third-party TypeScript libraries in projects, so
TSD is worth to be mentioned. This tool allows to search, install and update
declaration files from one global repository of declaration files being kept by the TypeScript community.

For example, you can use `tsd query NAME` to search for a specific package NAME:

    tsd query angular2
    > - angular2 / angular2

To install Meteor declaration file, just type:

    tsd install meteor

All necessary files will be added into the "typings" directory.

Angular 2's declaration files are delivered via the offial NPM, so 
you won't be able to find it in the Definitely Typed repo.

Don't worry though, Angular2-Meteor will update all necessary typings, you only need periocally
to remove .d.ts-files in the "typings" folder, thus, letting the package know that
the files need to be updated.

## TypeScript Configuration

TypeScript is generally configured by the special JSON file called ["tsconfig.json"](https://github.com/Microsoft/typescript/wiki/tsconfig.json).

Angular2-Meteor packages uses a ts-compiler [package](https://github.com/barbatus/ts-compilers) that supports "tsconfig.json" file as well.
Just create a file with this name in the root folder of your app, and start adding options you'd like.
You can read about all possible options [here](https://github.com/Microsoft/TypeScript/wiki/Compiler-Options).

Please, note, since Meteor environment has some specifics, some of the options don't have sense in Meteor.
You can read about exceptions [here](https://github.com/barbatus/typescript#compiler-options).
Additonal options available in the package are described [here](https://github.com/barbatus/ts-compilers#typescript-config)


# Summary

In this step we discovered a new way to make TypeScript code less buggy by using TypeScript's type-checking.
Meanwhile we declared a new type for the party object, thus, realized type-checking support in the Socially app.
  
{{/template}}
