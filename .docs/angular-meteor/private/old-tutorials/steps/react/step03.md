{{#template name="react-step03"}}

# Storing tasks in a collection

{{> step03CollectionsIntro}}

Let's add a line of code to define our first collection:

{{> CodeBox step="3.1" view="react"}}

### Using data from a collection inside a React component

To use data from a Meteor collection inside a React component, include the `ReactMeteorData` mixin in a component. With this mixin in your component, you can define a method called `getMeteorData` which knows how to keep track of changes in data. The object you return from `getMeteorData` can be accessed on `this.data` inside the `render` method. Let's do this now:

{{> CodeBox step="3.2" view="react"}}

When you make these changes to the code, you'll notice that the tasks that used to be in the todo list have disappeared. That's because our database is currently empty &mdash; we need to insert some tasks!

{{> step03InsertingTasksFromConsole}}

{{/template}}
