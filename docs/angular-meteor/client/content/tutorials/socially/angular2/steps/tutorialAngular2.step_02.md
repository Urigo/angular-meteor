{{#template name="tutorialAngular2.step_02.md"}}
{{> downloadPreviousStep stepName="step_01"}}
    
Now it's time to make the web page dynamic — with Angular 2.

This step will still be focusing on client side Angular tools. The next one will show you how to get the power of Meteor.

# Data in the View

In Angular, the view is a projection of the model through the HTML template. This means that whenever the model changes, Angular refreshes the appropriate binding points, which updates the view.

Let's change our template to be dynamic:

{{> DiffBox tutorialName="meteor-angular2-socially" step="2.1"}}

We replaced the hard-coded party list with the [NgFor](https://angular.io/docs/js/latest/api/directives/NgFor-class.html) directive and two Angular expressions:

* The `*ng-for="#party of parties"` attribute in the `li` tag is an Angular repeater directive. The repeater tells Angular to create a `li` element for each party in the list using the `li` tag as the template.
* The expressions wrapped in double-curly-braces ( `{{dstache}}party.name}}` and `{{dstache}}party.description}}` ) will be replaced by the value of the expressions.

To get this to work, we'll have to import NgFor and tell Angular 2 we are using it in the template.

{{> DiffBox tutorialName="meteor-angular2-socially" step="2.2"}}

Just to be clear, make sure you:

- added `NgFor` to the `import` statement.
- added `NgFor` as a directive in the view

Why so much work setting up a new dependency? Angular 2 is trying to avoid namespace collisions, so dependencies are always imported and specified.

# Component as a Controller

One convenient way to think of a components role in Angular2 is as the role played by ````ngController```` in Angular 1.x.
Each component defines it's own view via the ````View```` annotation and creates a data model that will be rendered in the view. 

Everything else is done within event handlers and other code that controls data flow between the view and the user
and updates the data model accordingly.

Now we are going to create out initial data model and render it in the view.
This code will go inside of our Socially class [`constructor`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor). A constructor is a function run when a class is loaded, thus it loads the initial data for the class.

We can attach data with the context 'this', referring to the Socially class.

{{> DiffBox tutorialName="meteor-angular2-socially" step="2.3"}}

Run the app again.

    meteor

At this moment you will see a message in the console: _Property 'parties' does not exist on type 'Socially'_.
These kind of messages can be annoying, but they do a great job — keep our code less buggy.

It's so easy, for example, to misspell the name of a property in dynamic languages like JavaScript.
Thanks to TypeScript, we can use this compilation diagnostics to
create less error-prone JavaScript applications.

This comes as a great benefit of choosing TypeScript as a primary language
for our app. So lets define our `parties` property:

{{> DiffBox tutorialName="meteor-angular2-socially" step="2.4"}}

You'll see the data model, parties, is now instantiated within the Socially component.

Although the controller is not yet doing very much, it plays a crucial role. The controller allows us to establish data-binding between the model and the view. We connected the dots between the presentation, the data, and the business logic as follows:

- The selector 'app', located on the `body` tag, references the name of our class, `Socially` (located in the JavaScript file `app.js` which is compiled automatically from `app.ts`).
- The class Socially references the View using the templateUrl path to `client/app.html`
- The Socially class constructor loads the data into properties of the component class itself, thus proving the data model for the view.
- The template, `app.html` accesses `parties` using the Socially class context

# Summary

You now have a dynamic app that features separate model, view and controller components.

But, this is still all client side - which is nice for tutorials, but in a real application we need to persist the data on the server and sync all the clients with it.

So, let's go to [step 3](/tutorial/step_03) to learn how to bind our application to the great power of Meteor.

{{/template}}
