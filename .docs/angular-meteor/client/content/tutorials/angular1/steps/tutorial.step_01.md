{{#template name="tutorial.step_01.md"}}
{{> downloadPreviousStep stepName="step_00"}}

Let's create a purely static HTML page and then examine how we can turn this HTML code into a template that Angular will use to dynamically display the same result with any set of data.

Add this template HTML to `index.ng.html`:

{{> DiffBox tutorialName="angular-meteor" step="1.1"}}

Next we'll dynamically generate the same list using AngularJS.

{{/template}}
