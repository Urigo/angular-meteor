{{#template name="tutorials.socially.angular2.step_02.md"}}
{{> downloadPreviousStep stepName="step_01"}}

Now it's time to make the web page dynamic — with Angular 2.

This step will still be focusing on client side Angular tools. The next one will show you how to get the power of Meteor.

# Data in the View

In Angular, the view is a projection of the model through the HTML template. This means that whenever the model changes, Angular refreshes the appropriate binding points, which updates the view.

Let's change our template to be dynamic:

{{> DiffBox tutorialName="meteor-angular2-socially" step="2.1"}}

We replaced the hard-coded party list with the [NgFor](https://angular.io/docs/js/latest/api/directives/NgFor-class.html) directive and two Angular expressions:

- The `*ngFor="#party of parties"` attribute in the `li` tag is an Angular repeater directive. The repeater tells Angular to create a `li` element for each party in the list using the `li` tag as the template.
- The expressions wrapped in the double curly braces ( `{{dstache}}party.name}}` and `{{dstache}}party.description}}` ) will be replaced by the value of the expressions.

Angular 2 has _common_ directives that provide additional functionality to HTML. These include `ngFor`, `ngIf`, `ngClass`, _form_ directives (which will be heavily used on the 4th step) and more found in the [`angular2/common`](https://angular.io/docs/ts/latest/api/common/) package. The main point about them is that they are globally available in every component template, which means you don't need to import them manually into the component's view, in comparison to a custom directive or routing directives.

We'll be creating own components, as well as use routing in the next steps, so you'll learn hands on everything you need.

# Component as a Controller

Each component defines it's own view via the `View` annotation and creates a data model that will be rendered in the view. One convenient way to think of a component's role in Angular 2 is as the role played by `ngController` in Angular 1.x.

Everything else is done within event handlers and other code that controls data flow between the view and the user
and updates the data model accordingly.

Now we are going to create out initial data model and render it in the view.
This code will go inside of our Socially class [`constructor`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor). A constructor is a function that runs when a class is loaded, thus it loads the initial data for the class.

We can attach data with the context `this`, referring to the Socially class.

{{> DiffBox tutorialName="meteor-angular2-socially" step="2.2"}}

Run the app again.

    meteor

At this moment you will see a message in the console: _Property "parties" does not exist on type "Socially"_.
These kind of messages can be annoying, but they provide important information that can help keep our code less buggy.

It's so easy to unknowingly misspell the name of a property in dynamic languages like JavaScript.
Thanks to TypeScript, we can use compilation diagnostics to create less bug-prone JavaScript applications.

This comes as a great benefit of choosing TypeScript as a primary language
for our app. So lets define our `parties` property as it is, a [type](http://www.typescriptlang.org/Handbook#basic-types) of array made up of [generic](http://www.typescriptlang.org/Handbook#generics) Objects.:

{{> DiffBox tutorialName="meteor-angular2-socially" step="2.3"}}

You'll see the data model, parties, is now instantiated within the Socially component.

Although the controller is not yet doing very much, it plays a crucial role. The controller allows us to establish data-binding between the model and the view. We connected the dots between the presentation, the data, and the business logic as follows:

- The selector 'app', located on the `body` tag, references the name of our class, `Socially` (located in the JavaScript file `app.js` which is compiled automatically from `app.ts`).
- The class Socially references the View using the templateUrl path to `client/app.html`
- The Socially class constructor loads the data into properties of the component class itself, thus providing the data model for the view.
- The template, `app.html` accesses `parties` using the Socially class context

# Summary

You now have a dynamic app that features separate model, view and controller components.

But, this is still all client side — which is nice for tutorials, but in a real application we need to persist the data on the server and sync all the clients with it.

So, let's go to [step 3](/tutorials/angular2/3-way-data-binding) to learn how to bind our application to the great power of Meteor.

{{/template}}
