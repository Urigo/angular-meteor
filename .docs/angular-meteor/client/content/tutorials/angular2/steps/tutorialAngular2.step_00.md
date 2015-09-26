{{#template name="tutorialAngular2.step_00.html"}}

> Disclaimer: Angular 2 is not yet production ready. The API will change. For now, consider this tutorial for educational purposes.

Let's start building our Meteor Angular 2 Socially app.

In this step, you will:

- Become familiar with the most important source code files
- Learn how to start the Meteor server
- Connect an Angular 2 FrontEnd
- Run the application in the browser

## Meteor Setup

First step — let's install Meteor!

Open your command line and paste this command:

    $ curl https://install.meteor.com/ | sh

> If you are on a Windows machine, go [here](https://www.meteor.com/install) to install

Now let's create our app — write this in the command line:

    $ meteor create socially

Now let's see what we got. Go into the folder:

    $ cd socially

and run the app like so:

    $ meteor

    => Started proxy
    => Started MongoDB.
    => Started your app.
    >=> App running at: http://localhost:3000/

Now go to [http://localhost:3000/](http://localhost:3000/)
and look at the amazing app that's running on your computer!

So, as you can see, we have a full running app which includes a server and a client!

The default Meteor app starts life with three files, one `js`, one `html` and one `css` file. Each named with the application name you used in the `create` command above. In our case this is `socially`.

We are going to add our own files for this tutorial. So let's start by deleting the following files:

    - socially.css    (delete)
    - socially.html   (delete)
    - socially.js     (delete)

Now we can start building our app.

Create a directory called `client`. It is important that the name is `client`. Meteor will run files inside this directory only on the client. More about that in step 7.

First, let's create a new `index.html` file and place this code inside. Then run the app again:

{{> DiffBox tutorialName="angular2-tutorial" step="0.1"}}

As you can see, there is no html tag, no head tag, very simple.

The reason for this is the way Meteor structures and serves files to the client.

Meteor scans all the HTML files in your application and concatenates them together.

It will create the `HTML`, `HEAD` and `BODY` tags by itself and place in there everything it needs to run the app.

Then it will search for all the HTML files containing `HEAD` or `BODY` tags and concatenate their content into the main file.


So in our case, Meteor found our `index.html` file, recognized it was meant for the client only, found the `BODY` tag inside and added it's content to the `BODY` tag of the main generated file.

> (right-click -> inspect element on the page to see the generated file)

## Angular 2 Package

Now it's time to add Angular 2 to our stack!

First things first, let's add the Angular 2 package to Meteor (we will discuss more about Meteor packages later in this tutorial)

Back in the command line, launch this command:

    $ meteor add urigo:angular2-meteor

This package takes care of connecting Angular to Meteor and includes the latest Angular 2 library code into our app.

## HTML

As you already know, Meteor processes all HTML files for you out of box.
Files will be concatenated into one page.

From other side, regular Angular (Angular 1.x or Angular2) apps have a modular structure, i.e.,
consist of a set of template HTML files and JavaScript component files. Each template file belongs to 
some component, for example, to a controller or a directive.
It means we would rather avoid concatenation all of them to let
Angular2 use own mechanism to load template files for appropriate components.

That's why `urigo:angular2-meteor` overrides standard Meteor HTML processor.
The only file that's treated the same as before — `index.html`. So you 
can add there `<HEAD>` or `<BODY>` tags if you want custom code there.
Presence of `index.html` is mandatory.

Think of `index.html` as the entry point of your app.
A bit later, you'll learn what code you'll need in the `index.html` to
load your root component to the app. 

So, in order to make `urigo:angular2-meteor` work, you'll need to remove standard HTML processor `blaze-html-templates`:

    $ meteor remove blaze-html-templates

## TypeScript

In this tutorial, we'll be using TypeScript. Don't worry if you're not familiar with TypeScript. Valid JavaScript is valid TypeScript.

TypeScript just adds more optional features to JavaScript such as types & interfaces. You'll be able to do this tutorial fine without understanding what these are yet; but if you'd like to learn more try the [TypeScript tutorial] ([Learn more](http://www.typescriptlang.org/Tutorial)).

Angular 2 app can be written in regular JavaScript (ES5), the new JavaScript (ES2015 aka ES6) or TypeScript.
Why TypeScript?

If you've chosen ES6 or TypeScript, it will need eventually to compile code into ES5 — the only language supported fully in modern browsers —  using Babel or Traceur compilers for pure ES6 or TypeScript compiler
for TypeScript.

However, TypeScript is the recommended choice by the Angular team. This is due to some reasons, one of them might be, for example, most advanced support of decorators in TypeScript among other compilers.
Decorators are still considered as an experimental feature that will likely appear only in ES7, so most compiler
don't have full support of them. Besides that, TypeScript has convenient built-in type-checking support via declaration files and richer toolkit in general.
What's decorators and how they are used in Angular2, you'll learn a bit later.

Angular2-Meteor packages comes with built-in TypeScript compiler plugin, which means for
now you don't need to worry about installing any other packages.

As of Meteor 1.2, Meteor supports ES6 by default, in order to avoid conflicts between
TypeScript and Meteor Ecmascript package, you'll need to remove it:

    $ meteor remove ecmascript

TypeScript compiler will convert our `.ts` files to valid `.js` files.

ES6 & TypeScript both use modules. These are the `import` and `export` statements that have arrived in JavaScript.

## System.js

As you already know, ES6 has modules convention (`import` and `export` are part of it), which is a set of rules and syntax used to load modules.
Since modern browsers doesn't support ES6 yet, JS community has come up with different realizations of this convention in ES5.

We are going to use System.js, which is supported out of box in the `urigo:angular2-meteor` package.
It means that you don't need to worry much about ES6 modules — TypeScript and System.js will do everything for you behind the scene.

There is only one thing that you'll need to do potentially.
You'll know what is it a bit later.

# Root Component

Angular 2 code is structured like a tree of components inside of each other, where each component
is a controller with an attached view. Since it's a tree, there should be a root component and leaf components
that stem out of it. So let's create our root component.

Create a new `app.ts` file inside of the `client` folder.

Now you can see another example of Meteor's power and simplicity - no need to include this file anywhere. Meteor will take care of it by going through all the files in the folder and including them automatically.

Let's continue defining our Angular 2 application module.

{{> DiffBox tutorialName="angular2-tutorial" step="0.5"}}

First we're importing the dependencies we needed from `angular2/angular2`. This is not a folder and file in your directory, but a reference to a System.js module aliased `angular2/angular2` and available in the `urigo:angular2-meteor` package.

Notice the `@` syntax. In Angular 2, these are called Annotations. They are similar to a new feature coming to ES7 called Decorators.
From consumers point of view, they are almost the same except Decorators are a proposed standard allowing us to add class metadata and Angular2's Annotations are 
a realization of that metadata, implemented with the help of Decorators in TypeScript.
You can read more about the differences between the two [here](http://blog.thoughtram.io/angular/2015/05/03/the-difference-between-annotations-and-decorators.html).

For now, consider Annotations is an elegant way to add metadata to classes.

Also notice, the Component's selector matches the `<app>` tag we provided in index.html, and View template creates the view.

The class, Socially, inherits from @Component and @View.

Finally, we `bootstrap` our component, thus, marking it as the root component. An Angular 2 app can have multiple root components, but components must exist together within the same root in order to communicate with each other.

## Running app

The only thing left before we can run our app is to import the root module and 
add `<app>` tag to the `index.html`.

As you've already learned, the package uses System.js to manage ES6 modules, but System.js
doesn't know anything about our `app` module.
So lets import manually our `app` module and add `<app>` tag to the `index.html` as follows:

{{> DiffBox tutorialName="angular2-tutorial" step="0.6"}}

This will load HTML and JavaScript code necessary to launch our app.

Importing root module every time looks like a repetative task.
Here comes good news — Angular2 package recognizes file named `app.ts`.
if you have one in the app root folder, package will import it for you  behind the scene.
We also can remove `<body>` tag.

It means we can simplify `index.html` above to just:

{{> DiffBox tutorialName="angular2-tutorial" step="0.7"}}

Now run the app.

    $ meteor

## TypeScript Typings

At this moment you've likely noticed a message in the console saying that `angular2/angular2` is not found.

It happened because TypeScript compiler is configured in the package with diagnostics messages turned on by default and
TypeScript compiler doesn't know anything about `angular2/angular2` module. To fix this, you will need
to make use of TypeScript declaration files, which is a TypeScript way to inform compiler about API of third-party modules.


After first run, you will find `angular2-meteor.d.ts` file in the new folder called "typings".
This file has been created by the package at the start time and contains a special reference to Angular2 and Meteor declaration files.
Link `app.ts` and `angular2-meteor.d.ts` by adding next line at the top of `app.ts`:

{{> DiffBox tutorialName="angular2-tutorial" step="0.8"}}

> Note: if you just loaded your app from a repository, you'll need to re-start it once.
> This is due to Meteor local hierachy of files is not built yet at the time TypeScript compiler accesses them.


# Templates

Let's make one change. Create a new file called `app.html` under the 'client' folder, this will be our main `HTML` template page:

{{> DiffBox tutorialName="angular2-tutorial" step="0.9"}}

Change your template in `app.ts` to target `app.html`:

{{> DiffBox tutorialName="angular2-tutorial" step="0.10"}}
   
Now our component template will load from the given path.
As you can see, we are using Angular expression inside of `app.html` to check if it works:

    <p>Nothing here {{dstache}} "yet" + "!" }}</p>

Run the app again and the screen should look like this:

    Nothing here yet!

Angular interpreted the expression like any other Angular application.

> If the template doesn't change, it may be because your browser is caching the original template.
> Learn [how to disable caching during development](https://developer.chrome.com/devtools/docs/settings) with Chrome.

# Experiments
Try adding a new expression to the index.ng.html that will do some math:

    <p>1 + 2 = {{dstache}} 1 + 2 }}</p>

# Summary
Now let's go to [step 1](/tutorials/angular2/static-template) and add some content to our application.

{{/template}}
