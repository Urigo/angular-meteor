{{#template name="tutorialAngular2.step_00.md"}}

> Disclaimer: Angular 2 isn't stable yet, and the API might change. For now, consider this tutorial for educational purposes.

Let's start building our Meteor Angular 2 Socially app.

In this step, we will:

- Setup Meteor and create an app
- Become familiar with the app's structure
- Connect an Angular 2 front end
- Run the application in the browser

# Meteor Setup

First step — let's install Meteor!

Open your command line and paste this command:

    $ curl https://install.meteor.com/ | sh

> If you are on a Windows machine, go [here](https://www.meteor.com/install) to install Meteor.

Now let's create our app — write this in the command line:

    $ meteor create socially

Now let's see what we got. Go into the new folder:

    $ cd socially

Run the app like so:

    $ meteor

    => Started proxy
    => Started MongoDB.
    => Started your app.
    >=> App running at: http://localhost:3000/

Now go to [http://localhost:3000/](http://localhost:3000/)
and look at the amazing app that's running on your computer!

We now have a fully functional app which includes both a server and a client!

The default Meteor app starts life with three files, one `js`, one `html` and one `css` file. Each named with the application name you used in the `create` command above. In our case this is `socially`.

We are going to add our own files for this tutorial. So let's start by deleting the following files:

    - socially.css    (delete)
    - socially.html   (delete)
    - socially.js     (delete)

Now we can start building our app.

Create a directory called `client`. It is important that the name is `client`, because Meteor will run files inside this directory only on the client. More about that in step 7.

Create a new `index.html` file in the client folder, and place this code inside. Then run the app again.

{{> DiffBox tutorialName="meteor-angular2-socially" step="0.1"}}

Note that there is no `<html>` tag and no `<head>` tag - it's very simple.

This is because of how Meteor structures and serves files to the client.

Meteor scans all the HTML files in your application and concatenates them together.

Concatenation means merging the content of all `HTML`, `HEAD` and `BODY` tags found inside these HTML files together.

So in our case, Meteor found our `index.html` file, recognized it was meant for the client only, found the `BODY` tag inside and added it's content to the `BODY` tag of the main generated file.

> (right-click -> inspect element on the page to see the generated file)

# Adding Angular 2

It's time to add Angular 2 to our stack!

First things first, let's add the Angular 2 package to Meteor (we will discuss Meteor packages later in this tutorial)

Back in the command line, launch this command:

    $ meteor add urigo:angular2-meteor

This package takes care of connecting Angular 2 to Meteor and includes the latest Angular 2 library code into our app.

That's it! Now we can use Angular 2's power in our Meteor app.

## HTML

As you already know, Meteor processes all HTML files for you out of box.
Files will be concatenated into one page.

From other side, regular Angular (Angular 1 or Angular2) apps have a modular structure, i.e.,
consist of a set of template HTML files and JavaScript component files.
Each template file might belong to some component, for example, to a custom directive.

It means we would rather avoid concatenation all of them to let
Angular2 components to load template files at the moment they need to.

That's why `urigo:angular2-meteor` overrides standard Meteor HTML processor.
Lets remove standard HTML processor by:

    $ meteor remove blaze-html-templates

This package has own HTML processor that recognizes two types of HTML files: one type — files that contain
`<HEAD>` and `<BODY>` tags, everything else — considered as template files.

If you have multiple HTML files with, say, `<BODY>` tags, they will be concatenated 
all together into one file the same way as in case of the standard HTML processor.

At the same time, template files are not touched by the processor at all
and won't appear on the page initially.

They will be loaded by appropriate Angular2 components at the time
they are going to be rendered on the page.

## TypeScript

In this tutorial, we'll be using TypeScript. Don't worry if you're not familiar with TypeScript. Valid ES6 or ES5 JavaScript is valid TypeScript.

TypeScript just adds more optional features to JavaScript such as types & interfaces. You'll be able to do this tutorial fine without understanding what these are yet; but if you'd like to learn more try the TypeScript tutorial. ([Learn more](http://www.typescriptlang.org/Tutorial)).

An Angular 2 app can be written in regular JavaScript (ES5), the new JavaScript (ES2015 aka ES6) or TypeScript.
Why TypeScript?

If you've chosen ES6 or TypeScript, it will need eventually to compile code into ES5 — the only language currently fully supported in modern browsers. ES6 can be compiled to ES5 using Babel or Traceur, while Typescript has it's own compiler.

TypeScript is the recommended choice by the Angular team. This is due to some reasons, one of them is most advanced support of decorators in TypeScript among other compilers.
Decorators are still considered as an experimental feature that will likely appear only in ES7, so most compiler
don't have full support of them. What's decorators and how they are used in Angular2? You'll learn a bit more later.

Besides decorators reason, TypeScript has convenient built-in type-checking support via declaration files and richer toolkit in general
in comparison to other mentioned compilers.

Angular2-Meteor packages come with a built-in TypeScript compiler plugin, which means
you don't need to worry about installing any other compiler packages.

As of Meteor 1.2, Meteor supports ES6 by default, in order to avoid conflicts between
TypeScript and Meteor ECMAScript package, you'll need to remove it:

    $ meteor remove ecmascript

As you already might know, there are new `import` and `export` statements that have arrived in ES6.
They are part of a notation that is supposed to separate an app into isolated modules, thus, helping
us to structure our app as we want.

TypeScript can compile each file into a separate module.
So lets learn how we are going use modules in our app.

## System.js

ES6 has a new module notation (`import` and `export` are part of it), which is a set of rules and syntax used to load separate modules.
Since modern browsers don't support ES6 yet, the JS community has come up with different implementations of this convention in ES5.

We are going to use System.js, which is supported out of box in the `urigo:angular2-meteor` package.

Most of time you won't need to worry much about ES6 modules — TypeScript and System.js will do everything for you behind the scenes.
TypeScript will compile a `ts`-file into a separate System.js module by default in this package
and System.js will load its dependencies and the module itself on demand.

There is only one small thing that you'll need to potentially do to bootstrap your app. You'll also know what is it a bit later.

# Root Component

Angular 2 code is structured like a tree of components inside of each other, where each component
is a controller with an attached view. Since it's a tree, there should be a root component and branch components
that stem out of it. So let's create our root component.

Create a new `app.ts` file inside of the `client` folder.

Now you can see another example of Meteor's power and simplicity - no need to include this file anywhere. Meteor will take care of it by going through all the files in the folder and include them automatically.

Let's continue defining our Angular 2 application module.

{{> DiffBox tutorialName="meteor-angular2-socially" step="0.5"}}

First we're importing the dependencies we needed from `angular2/angular2`. This is not a folder and file in your directory, but a reference to a System.js module aliased as `angular2/angular2` and available in the `urigo:angular2-meteor` package.

Notice the `@` syntax. In Angular 2, these are called Annotations. They are similar to a new feature coming to ES7 called Decorators.
From consumers point of view, they are almost the same except Decorators are a proposed standard allowing us to add class metadata and Angular2's Annotations are 
a realization of that metadata, implemented with the help of Decorators in TypeScript.
You can read more about the differences between the two [here](http://blog.thoughtram.io/angular/2015/05/03/the-difference-between-annotations-and-decorators.html).

For now, consider Annotations an elegant way to add metadata to classes.

Also notice, the Component's selector matches the `<app>` tag we provided in `index.html`, and the View template creates the view.

The class, Socially, inherits from `@Component` and `@View`.

Finally, we `bootstrap` our component, thus, marking it as the root component. An Angular 2 app can have multiple root components, but components must exist together within the same root in order to communicate with each other.

## Run the App

The only thing left before we can run our app is to import the root module and 
add the `<app>` tag to `index.html`.

As you've already learned, the package uses System.js to manage ES6 modules, but System.js
doesn't know anything about our `app` module.
So lets manually import our `app` module and add `<app>` tag to the `index.html` as follows:

{{> DiffBox tutorialName="meteor-angular2-socially" step="0.6"}}

This will load HTML and JavaScript code necessary to launch our app.

Importing root module every time looks like a repetitive task.
Here comes good news — the Angular2 package recognizes the file named `app.ts`.
If you have one in the app root folder, the package will import it for you without even having to ask.

Even more, if you called your app selector — `app`, you can get rid of `index.html` altogether. 
The package adds default layout with the `<app>` tag automatically as follows:

    <body>
        <app></app>
    </body>

> Note: default layout is added only when there are no any other HTML files
> with `head` or `body` tags.

So lets remove `index.html` for now and run the app:

    $ meteor

## TypeScript Typings

At this moment you've likely noticed a message in the console saying that `angular2/angular2` is not found.

It happened because the TypeScript compiler is configured in the package with diagnostics messages turned on by default and
the TypeScript compiler doesn't know anything about the location of the `angular2/angular2` module. To fix this, you will need
to make use of TypeScript declaration files, which is a TypeScript way to inform the compiler about third-party API modules.

After the first run, you will find the `angular2-meteor.d.ts` file in the new folder called "typings".
This file has been created by the package at start time and contains a special reference to Angular2 and Meteor declaration files.
Link `app.ts` and `angular2-meteor.d.ts` by adding the next line at the top of `app.ts`:

{{> DiffBox tutorialName="meteor-angular2-socially" step="0.8"}}

> Note: if you just loaded your app from a repository, you'll need to re-start it once.
> This is because Meteor's local hierarchy of files is not yet built at the time the TypeScript compiler accesses them.


# Templates

Let's make one change. Create a new file called `app.html` under the 'client' folder, this will be our main `HTML` template page:

{{> DiffBox tutorialName="meteor-angular2-socially" step="0.9"}}

Change your template in `app.ts` to target `app.html`:

{{> DiffBox tutorialName="meteor-angular2-socially" step="0.10"}}
   
Now our component template will load from the given path.
As you can see, we are using an Angular expression inside of `app.html` to check if it works:

    <p>Nothing here {{dstache}} "yet" + "!" }}</p>

Run the app again and the screen should look like this:

    Nothing here yet!

Angular interpreted the expression like any other Angular application.

> If the template doesn't change, it may be because your browser is caching the original template.
> Learn [how to disable caching during development](https://developer.chrome.com/devtools/docs/settings) in Chrome.

# Experiments
Try adding a new expression to the `app.html` that will do some math:

    <p>1 + 2 = {{dstache}} 1 + 2 }}</p>

# Summary
Let's continue to [step 1](/tutorials/angular2/static-template) and add some content to our application.

{{/template}}
