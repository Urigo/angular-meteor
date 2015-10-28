{{#template name="tutorialAngular2.step_07.md"}}
{{> downloadPreviousStep stepName="step_06"}}  

In this article, we'll look at two things:

- Meteor's file structure with Angular 2
- Using TypeScript features

# File Structure

As we are using the ES2015 module loading, Meteor's file loading conventions don't have much effect.

Instead, just keep in mind the power of a few folders:

- client: on the client
- server: on the server
- anywhere else: both

If your app grows in size, you may consider breaking it into smaller parts with these sections included inside. For example:

    parties
      \- client
      \- server
      \- model, etc.
    events
      \- client
      \- server
      \- model, etc

Meteor will combine these together auto-magically.

# TypeScript

Earlier I mentioned that TypeScript has features which make it more powerful than ES2015 alone. We'll look at some of these.

We don't have time to cover the uses and benefits of types here in detail, but I'd encourage you to [learn more](http://www.typescriptlang.org/).

## TypeScript: Supported editors

TypesScript runs during development time, giving you better code completion and informing you of potential errors in your code.

To get the power of TypeScript, use a TypeScript friendly editor. These include:

* [Visual Studio or VS Code](https://www.visualstudio.com/)
* [Webstorm](https://www.jetbrains.com/webstorm/)
* [Atom](https://atom.io/packages/atom-typescript)
* [Sublime Text](https://github.com/Microsoft/TypeScript-Sublime-Plugin)
* [Eclipse](https://github.com/palantir/eclipse-typescript)

Let's look at some of the features of TypeScript in brief detail.

## TypeScript: Types

[Types](http://www.typescriptlang.org/Handbook#basic-types) help you find mistakes. For example, we can let the TypeScript compiler know that the `partyId` should be a string, and that routeParams should have the type of RouteParams. If partyId ever returns a number, or array, we know something went wrong right away. It will become highlighted by your IDE or text editor.

Keep in mind, type-checking is not delivered in the outputted JavaScript. It is only extra sugar for your development environment, and adds no weight to the outputted `.js` file.

{{> DiffBox tutorialName="angular2-meteor" step="7.1"}}

## TypeScript: Interfaces

[Interfaces](http://www.typescriptlang.org/Handbook#interfaces) sound complicated, but I can assure you, they are very simple. They are just groups of types in an object.

We could declare a party as:

    party: {
      name: string;
      description: string;
    }

But that would get repetitive. Instead, we can call it an interface once, and re-use the type. Let's call it IParty, I for interface.

Put IParty in a folder `typings/socially` and call it `socially.d.ts`. Now it can be shared across the app.

{{> DiffBox tutorialName="angular2-meteor" step="7.2"}}

Note that `_id` is marked as optional, as parties won't get the id until they are passed into a Mongo collection.

We can use IParty to declare some types in our app. For example, in `party-details.ts` I've made several type declarations.

{{> DiffBox tutorialName="angular2-meteor" step="7.3"}}

Identifying that both party & resetToParty should have strings for a name and description. Otherwise, the IDE or text editor should let me know something is wrong. Maybe I made a typo.

We can also specify that any declaration of parties is an array of IParty.

{{> DiffBox tutorialName="angular2-meteor" step="7.4"}}

As well as on the server within Meteor. TypeScript works everywhere.

{{> DiffBox tutorialName="angular2-meteor" step="7.5"}}

This all keeps you notified about mistakes or typos. TypeScript's power is seen more and more as your project and team grow.

## TypeScript: Declare

You may have noticed that Meteor's global variables are being highlighted by your TypeScript checker. This is because we haven't yet declared them. Let's fix that.

{{> DiffBox tutorialName="angular2-meteor" step="7.6"}}

Declaring items let's TypeScript know that `Parties` is an accepted variable.

## TypeScript: Type Definition Files

[TSD](https://github.com/DefinitelyTyped/tsd) is a package manager for type definition files from [Definitely Typed](http://definitelytyped.org/).

    npm install tsd -g

You can use `tsd query NAME` to search for a specific package NAME. For example:

    tsd query angular2
    > - angular2 / angular2

Let's install type definition files for Angular 2 & Meteor.

    tsd install angular2
    tsd install meteor

These files are loaded into the `typings` directory.

  - client
  - server
  - typings
      \- socially
      \- angular2
      \- es6-promise
      \- meteor
      \- rx

Now we will have the interfaces from these different frameworks.

* Note: The Angular 2 typescript files may not be currently up to date as the API is changing. *

Let's specify that `Parties` is actually a Mongo collection, which will be picked up by TypeScript.

{{> DiffBox tutorialName="angular2-meteor" step="7.8"}}

Now if Parties is returning anything other than a valid Mongo Collection, we'll get an error.


## TypeScript: Generics

A [generic](http://www.typescriptlang.org/Handbook#generics) is a varable that can be passed into an interface. You can recognize it from the `<T>` syntax. Let's look back at `Parties` again.

{{> DiffBox tutorialName="angular2-meteor" step="7.9"}}

Now we've told TypeScript that Parties is a Mongo Collection made up of not just anything, but only IParty elements.


# Challenge

- Add types, interfaces, generics, declarations & type Definition files to your project.
- Or not, as mentioned previously, TypeScript features are optional. Without them, you're basically just writing ES2015 code and compiling it to ES5.
  
{{/template}}
