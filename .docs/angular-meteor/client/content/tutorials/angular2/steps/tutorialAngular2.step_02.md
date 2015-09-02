{{#template name="tutorialAngular2.step_02.html"}}
{{> downloadPreviousStep stepName="step_01"}}
    
Now it's time to make the web page dynamic — with Angular 2.

This step will still be focusing on client side Angular tools. The next one will show you how to get the power of Meteor.

# Data in the View

In Angular, the view is a projection of the model through the HTML template. This means that whenever the model changes, Angular refreshes the appropriate binding points, which updates the view.

Let's change our template to be dynamic:

{{> DiffBox tutorialName="angular2-meteor" step="2.1"}}

We replaced the hard-coded party list with the [NgFor](https://angular.io/docs/js/latest/api/directives/NgFor-class.html) directive and two Angular expressions:

* The `*ng-for="party of parties"` attribute in the `li` tag is an Angular repeater directive. The repeater tells Angular to create a `li` element for each party in the list using the `li` tag as the template.
* The expressions wrapped in double-curly-braces ( `{{dstache}}party.name}}` and `{{dstache}}party.description}}` ) will be replaced by the value of the expressions.

To get this to work, we'll have to import NgFor and tell Angular 2 we are using it in the template.

{{> DiffBox tutorialName="angular2-meteor" step="2.2"}}

Just to be clear, make sure you:

- added `NgFor` to the `import` statement.
- added `NgFor` as a directive in the view

Why so much work setting up a new dependency? Angular 2 is trying to avoid namespace collisions, so dependencies are always imported and specified.

# Model and Controller

Now we are going to create our controller and model. Think of the class as the controller, and the model as the data the control holds.

The data will go inside of our Socially class [`constructor`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor). A constructor is a function run when a class is loaded, thus it loads the initial data for the class.

This is not crazy TypeScript syntax, this is what JavaScript looks like now as of ES2015.

We can attach data with the context 'this', referring to the Socially class.

{{> DiffBox tutorialName="angular2-meteor" step="2.3"}}

Run the app again.

    meteor

You'll see the data model, parties, is now instantiated within the Socially component.

Although the controller is not yet doing very much, it plays a crucial role. By providing context for our data model, the controller allows us to establish data-binding between the model and the view. We connected the dots between the presentation, the data, and the logic components as follows:

- The selector 'app', located on the `body` tag, references the name of our class, `Socially` (located in the JavaScript file `app.js` which is compiled automatically from `app.ts`).
- The class Socially references the View using the templateUrl path to `client/index.ng.html`
- The Socially class constructor loads the data into the class, using the context of the class itself (this).
- The template, `index.ng.html` accesses `parties` using the Socially class context

# Summary

You now have a dynamic app that features separate model, view and controller components.

But, this is all client side, which is nice for tutorials, but in a real application we need to persist the data on the server and sync all the clients with it.

So, let's go to [step 3](/tutorial/step_03) to learn how to bind our application to the great power of Meteor.

{{/template}}
